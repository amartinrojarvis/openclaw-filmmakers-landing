// API Route: Webhook de Stripe para procesar eventos de pago
// POST /api/stripe/webhook

import { NextRequest, NextResponse } from 'next/server';
import {
  ASESORIA_PORTAL_LOGIN_URL,
  getAdvisoryPlanFromPriceIds,
  getStripe,
  getProductTypeFromPriceId,
  STRIPE_PRICE_IDS,
  syncAdvisoryCapacity,
} from '@/lib/stripe';
import { sendGuiaEmail, sendBundleEmail, sendDirectBrevoEmail, addContactToBrevoList, BREVO_LIST_IDS } from '@/lib/brevo';
import {
  bookingNotificationMetadata,
  hasSentBookingNotification,
  notificationIdempotencyKey,
} from '@/lib/booking-notifications';
import Stripe from 'stripe';

// Deshabilitar el body parser para poder verificar la firma del webhook
export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('=== WEBHOOK RECIBIDO ===');
  console.log('Timestamp:', new Date().toISOString());
  
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  console.log('Signature exists:', !!signature);
  console.log('Webhook secret exists:', !!webhookSecret);
  console.log('Stripe key exists:', !!stripeKey);

  if (!signature) {
    console.error('Webhook: Falta firma de Stripe');
    return NextResponse.json(
      { error: 'Falta firma de Stripe' },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    console.error('Webhook: STRIPE_WEBHOOK_SECRET no configurado');
    return NextResponse.json(
      { error: 'Webhook secret no configurado' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verificar la firma del webhook
    console.log('Verificando firma...');
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
    console.log('Firma verificada OK. Event type:', event.type);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`Webhook: Error verificando firma: ${errorMessage}`);
    return NextResponse.json(
      { error: `Firma inválida: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Manejar el evento
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const eventSession = event.data.object as Stripe.Checkout.Session;
        // El payload original del evento no cambia entre reintentos. Recuperar la
        // sesión fresca permite leer la marca persistente añadida tras el primer envío.
        const session = await getStripe().checkout.sessions.retrieve(eventSession.id, {
          expand: ['line_items'],
        });
        if (hasSentBookingNotification(session.metadata)) {
          console.log(`Reserva ${session.id} ya notificada. Saltando evento ${event.id}.`);
          return NextResponse.json({ received: true, idempotent: true });
        }
        await handleCheckoutCompleted(session, event.id);
        break;
      }

      case 'payment_intent.succeeded': {
        // Confirmacion adicional del pago (opcional)
        console.log('PaymentIntent exitoso:', event.data.object.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        // Manejar fallo de pago
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent fallido:', paymentIntent.id);
        break;
      }

      case 'checkout.session.expired': {
        // Checkout expirado sin completar
        console.log('Checkout expirado:', event.data.object.id);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await handleSubscriptionLifecycle(event.data.object as Stripe.Subscription, event.type, event.id);
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_failed': {
        console.log(`Evento de factura: ${event.type} · ${event.data.object.id}`);
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`Webhook: Error procesando evento ${event.type}:`, errorMessage);
    return NextResponse.json(
      { error: 'Error procesando evento' },
      { status: 500 }
    );
  }
}

/**
 * Maneja la finalización exitosa de un checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, eventId: string): Promise<void> {
  console.log('=== handleCheckoutCompleted INICIO ===');
  console.log('Session ID:', session.id);
  console.log('Status:', session.status);
  console.log('Payment status:', session.payment_status);
  console.log('Amount total:', session.amount_total);

  // Solo procesar si el pago fue exitoso
  if (session.payment_status !== 'paid') {
    console.log(`Pago no completado (status: ${session.payment_status}). Saltando envio de email.`);
    return;
  }

  // Obtener email del cliente
  const customerEmail = session.customer_email || session.customer_details?.email;
  console.log('Customer email (raw):', session.customer_email);
  console.log('Customer details email:', session.customer_details?.email);
  console.log('Customer email (final):', customerEmail);
  
  if (!customerEmail) {
    console.error('❌ ERROR: No se encontro email del cliente en la sesion:', session.id);
    return;
  }

  // Obtener las líneas para identificar la modalidad comprada.
  let lineItems: Stripe.LineItem[] = [];
  let productDescription: string = 'unknown';
  
  if (session.line_items && session.line_items.data.length > 0) {
    console.log('Line items ya presentes en sesión');
    lineItems = session.line_items.data;
  } else {
    console.log('Line items no presentes, recuperando de Stripe...');
    try {
      const sessionWithItems = await getStripe().checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      console.log('Sesión recuperada, line_items:', JSON.stringify(sessionWithItems.line_items, null, 2));
      lineItems = sessionWithItems.line_items?.data || [];
    } catch (err) {
      console.error('❌ ERROR recuperando session con line_items:', err);
      return;
    }
  }

  const priceId = lineItems[0]?.price?.id;
  const priceIds = lineItems.map((item) => item.price?.id).filter(Boolean);
  const advisoryPlan = getAdvisoryPlanFromPriceIds(priceIds);
  productDescription = lineItems[0]?.description || 'unknown';

  console.log('Price ID encontrado:', priceId);
  console.log('Product description:', productDescription);

  if (!priceId) {
    console.error('❌ ERROR: No se encontró priceId en la sesión:', session.id);
    return;
  }

  // Determinar qué producto compró
  const productType = getProductTypeFromPriceId(priceId);
  console.log('Product type:', productType);
  
  if (!productType) {
    console.error('❌ ERROR: Producto desconocido para priceId:', priceId);
    console.log('Precio ID bekend:', priceId);
    console.log('GUIA ID:', STRIPE_PRICE_IDS.GUIA);
    console.log('BUNDLE ID:', STRIPE_PRICE_IDS.BUNDLE);
    return;
  }

  console.log(`Procesando: Cliente ${customerEmail} compró ${productType}`);

  // Enviar email via Brevo según el producto + añadir a lista de compradores
  let emailResult: { success: boolean; error?: string } = { success: true };

  try {
    if (productType === 'asesoria_90m') {
      const intakeUrl = `https://www.iaparafilmmakers.es/gracias-asesoria?session_id=${encodeURIComponent(session.id)}`;
      if (!advisoryPlan) throw new Error(`Combinación de precios de asesoría desconocida: ${priceIds.join(',')}`);
      const isSubscription = advisoryPlan === 'subscription_monthly';
      const planLabel = isSubscription
        ? 'Suscripción mensual · primer mes'
        : advisoryPlan === 'followup_30d'
          ? 'Implementación · modalidad anterior'
          : 'Sesión estratégica de 90 minutos';
      const portalParagraph = isSubscription
        ? `<p>Para actualizar tu tarjeta, consultar facturas o cancelar al final del periodo, utiliza el <a href="${ASESORIA_PORTAL_LOGIN_URL}">portal seguro de Stripe</a>.</p>`
        : '';
      console.log('Procesando compra de asesoría...');
      const [customerMail, adminMail, listResult] = await Promise.all([
        sendDirectBrevoEmail({
          to: [{ email: customerEmail }],
          subject: isSubscription ? 'Tu suscripción mensual está activa — siguiente paso' : advisoryPlan === 'followup_30d' ? 'Tu primer mes de implementación está reservado — siguiente paso' : 'Tu sesión 1:1 está reservada — siguiente paso',
          idempotencyKey: notificationIdempotencyKey(eventId, 'customer'),
          htmlContent: `
            <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172018;line-height:1.65">
              <p>Hola,</p>
              <h1 style="font-size:28px;line-height:1.2">Tu reserva está confirmada: ${planLabel}.</h1>
              <p>Gracias por confiar en mí. Para preparar la sesión necesito que completes un formulario breve con tu objetivo y tus horarios preferidos.</p>
              <p style="margin:28px 0"><a href="${intakeUrl}" style="background:#172018;color:#d6ff4b;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold">Completar el formulario</a></p>
              <p>Después de recibirlo te confirmaré la fecha por email en un máximo de 48 horas laborables.</p>
              ${portalParagraph}
              <p>Un abrazo,<br><strong>Alberto Martín</strong><br>IA para Filmmakers</p>
            </div>`,
        }),
        sendDirectBrevoEmail({
          to: [{ email: 'a.martinro@gmail.com', name: 'Alberto Martín' }],
          subject: 'Nueva reserva — enlace del formulario listo para enviar',
          idempotencyKey: notificationIdempotencyKey(eventId, 'admin'),
          htmlContent: `
            <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172018;line-height:1.65">
              <h1 style="font-size:28px;line-height:1.2">Nueva reserva pagada</h1>
              <p><strong>Email del comprador:</strong> ${customerEmail}</p>
              <p><strong>Modalidad:</strong> ${planLabel}</p>
              <p><strong>Total cobrado:</strong> ${((session.amount_total || 0) / 100).toFixed(2)} €</p>
              <p><strong>Referencia de Stripe:</strong> ${session.id}</p>
              <p>Stripe lo redirige automáticamente al formulario y el comprador también recibe este enlace por email.</p>
              <p style="margin:28px 0"><a href="${intakeUrl}" style="background:#ff5a2a;color:#171612;text-decoration:none;padding:14px 22px;font-weight:bold">Abrir formulario del comprador</a></p>
              <p><strong>Enlace para copiar o reenviar:</strong></p>
              <p style="word-break:break-all"><a href="${intakeUrl}">${intakeUrl}</a></p>
            </div>`,
        }),
        addContactToBrevoList(customerEmail, BREVO_LIST_IDS.ASESORIA_PILOTO, {
          PRODUCTO: advisoryPlan,
          FECHA_COMPRA: new Date().toISOString(),
        }),
      ]);
      emailResult = customerMail;
      if (!customerMail.success || !adminMail.success) {
        throw new Error(`Fallo en notificaciones de reserva: cliente=${customerMail.error || 'ok'}, admin=${adminMail.error || 'ok'}`);
      }
      if (!listResult.success) console.error('Error añadiendo a lista de asesoría:', listResult.error);
    } else if (productType === 'bundle') {
      console.log('Llamando sendBundleEmail + addContactToBrevoList BUNDLE...');
      const [bundleEmailRes, bundleListRes] = await Promise.all([
        sendBundleEmail(customerEmail, notificationIdempotencyKey(eventId, 'bundle')),
        addContactToBrevoList(customerEmail, BREVO_LIST_IDS.BUNDLE, {
          PRODUCTO: 'bundle',
          FECHA_COMPRA: new Date().toISOString(),
        }),
      ]);
      emailResult = bundleEmailRes;
      if (!bundleListRes.success) {
        console.error('❌ ERROR añadiendo a lista BUNDLE:', bundleListRes.error);
      }
    } else {
      // GUIA: Solo añadir a lista. La automation de Brevo se encarga del email de bienvenida
      console.log('Añadiendo a lista GUIA (la automation de Brevo enviará el email)...');
      const guiaListRes = await addContactToBrevoList(customerEmail, BREVO_LIST_IDS.GUIA, {
        PRODUCTO: 'guia',
        FECHA_COMPRA: new Date().toISOString(),
      });
      if (!guiaListRes.success) {
        console.error('❌ ERROR añadiendo a lista GUIA:', guiaListRes.error);
        emailResult = { success: false, error: guiaListRes.error };
      } else {
        console.log('✅ Cliente añadido a lista GUIA. Automation de Brevo enviará el email.');
      }
    }
    if (!emailResult.success) {
      throw new Error(emailResult.error || 'No se pudo completar la notificación del pago');
    }
    console.log('Resultado:', JSON.stringify(emailResult));
  } catch (err) {
    console.error('❌ EXCEPTION procesando compra:', err);
    throw err;
  }

  let subscriptionMetadata: Record<string, string> = {};
  if (advisoryPlan === 'subscription_monthly' && session.subscription) {
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
    await getStripe().subscriptions.update(subscriptionId, {
      metadata: {
        ...subscription.metadata,
        iaf_checkout_session_id: session.id,
        service: 'iaf_monthly_implementation',
        plan: 'subscription_monthly',
      },
    });
    subscriptionMetadata = subscriptionLifecycleMetadata(subscription, eventId);
  }

  await getStripe().checkout.sessions.update(session.id, {
    metadata: {
      ...session.metadata,
      ...(advisoryPlan ? { advisory_plan: advisoryPlan } : {}),
      ...subscriptionMetadata,
      ...bookingNotificationMetadata(eventId),
    },
  });

  if (emailResult.success) {
    console.log(`✅ Email enviado a ${customerEmail} via Brevo (template ${productType})`);
  } else {
    console.error(`❌ ERROR enviando email a ${customerEmail}:`, emailResult.error);
  }
  if (productType === 'asesoria_90m') {
    try {
      const inventory = await syncAdvisoryCapacity();
      console.log(`Capacidad de asesoría sincronizada: ${inventory.remaining} plazas restantes`);
    } catch (error) {
      console.error('No se pudo sincronizar la capacidad compartida de asesoría:', error);
    }
  }
  console.log('=== handleCheckoutCompleted FIN ===');
}

function subscriptionLifecycleMetadata(subscription: Stripe.Subscription, eventId: string): Record<string, string> {
  const currentPeriodEnd = subscription.items.data
    .map((item) => item.current_period_end)
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  return {
    iaf_subscription_id: subscription.id,
    iaf_subscription_status: subscription.status,
    iaf_cancel_at_period_end: String(subscription.cancel_at_period_end),
    iaf_current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : '',
    iaf_subscription_event_id: eventId,
  };
}

async function handleSubscriptionLifecycle(
  subscription: Stripe.Subscription,
  eventType: string,
  eventId: string,
): Promise<void> {
  const isIafSubscription = subscription.items.data.some(
    (item) => item.price.id === STRIPE_PRICE_IDS.ASESORIA_SUBSCRIPTION_MONTHLY,
  );
  if (!isIafSubscription) {
    console.log(`Suscripción ${subscription.id} ajena a IAF; se ignora.`);
    return;
  }

  const checkoutSessionId = subscription.metadata.iaf_checkout_session_id;
  if (!checkoutSessionId?.startsWith('cs_')) {
    console.log(`Suscripción IAF ${subscription.id} todavía sin Checkout enlazado (${eventType}).`);
    return;
  }

  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  await stripe.checkout.sessions.update(checkoutSessionId, {
    metadata: {
      ...checkout.metadata,
      advisory_plan: 'subscription_monthly',
      ...subscriptionLifecycleMetadata(subscription, eventId),
    },
  });
  console.log(`Lifecycle IAF sincronizado: ${eventType} · ${subscription.id} · ${subscription.status}`);
}


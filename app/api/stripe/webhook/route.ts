// API Route: Webhook de Stripe para procesar eventos de pago
// POST /api/stripe/webhook

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getProductTypeFromPriceId, STRIPE_PRICE_IDS } from '@/lib/stripe';
import { sendGuiaEmail, sendBundleEmail } from '@/lib/brevo';
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

  console.log('Headers:', Object.fromEntries(request.headers.entries()));
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
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        // Confirmación adicional del pago (opcional)
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
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  console.log('=== handleCheckoutCompleted INICIO ===');
  console.log('Session ID:', session.id);
  console.log('Status:', session.status);
  console.log('Payment status:', session.payment_status);
  console.log('Amount total:', session.amount_total);

  // Obtener email del cliente
  const customerEmail = session.customer_email || session.customer_details?.email;
  console.log('Customer email (raw):', session.customer_email);
  console.log('Customer details email:', session.customer_details?.email);
  console.log('Customer email (final):', customerEmail);
  
  if (!customerEmail) {
    console.error('❌ ERROR: No se encontró email del cliente en la sesión:', session.id);
    return;
  }

  // Obtener detalles de la línea de items para saber qué producto compró
  let priceId: string | undefined;
  let productDescription: string = 'unknown';
  
  if (session.line_items && session.line_items.data.length > 0) {
    console.log('Line items ya presentes en sesión');
    priceId = session.line_items.data[0]?.price?.id;
    productDescription = session.line_items.data[0]?.description || 'unknown';
  } else {
    console.log('Line items no presentes, recuperando de Stripe...');
    try {
      const sessionWithItems = await getStripe().checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      console.log('Sesión recuperada, line_items:', JSON.stringify(sessionWithItems.line_items, null, 2));
      priceId = sessionWithItems.line_items?.data[0]?.price?.id;
      productDescription = sessionWithItems.line_items?.data[0]?.description || 'unknown';
    } catch (err) {
      console.error('❌ ERROR recuperando session con line_items:', err);
      return;
    }
  }

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

  // Enviar email via Brevo según el producto (usando plantillas)
  let emailResult: { success: boolean; error?: string };

  try {
    if (productType === 'bundle') {
      console.log('Llamando sendBundleEmail...');
      emailResult = await sendBundleEmail(customerEmail);
    } else {
      console.log('Llamando sendGuiaEmail...');
      emailResult = await sendGuiaEmail(customerEmail);
    }
    console.log('Email result:', JSON.stringify(emailResult));
  } catch (err) {
    console.error('❌ EXCEPTION enviando email:', err);
    emailResult = { success: false, error: String(err) };
  }

  if (emailResult.success) {
    console.log(`✅ Email enviado a ${customerEmail} via Brevo (template ${productType})`);
  } else {
    console.error(`❌ ERROR enviando email a ${customerEmail}:`, emailResult.error);
  }
  console.log('=== handleCheckoutCompleted FIN ===');
}


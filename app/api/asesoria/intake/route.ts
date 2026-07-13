import { NextRequest, NextResponse } from 'next/server';
import { getStripe, STRIPE_PRICE_IDS } from '@/lib/stripe';
import { sendDirectBrevoEmail } from '@/lib/brevo';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const ADMIN_EMAIL = 'a.martinro@gmail.com';

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function html(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('\n', '<br>');
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`asesoria-intake:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const sessionId = clean(body.sessionId, 160);
    const name = clean(body.name, 100);
    const activity = clean(body.activity, 150);
    const website = clean(body.website, 240);
    const experience = clean(body.experience, 50);
    const priority = clean(body.priority, 1600);
    const tools = clean(body.tools, 900);
    const availability = clean(body.availability, 900);
    const context = clean(body.context, 1200);
    const privacyAccepted = body.privacyAccepted === true;
    const earlyStartAccepted = body.earlyStartAccepted === true;

    if (!sessionId.startsWith('cs_') || !name || !activity || !priority || !availability || !privacyAccepted || !earlyStartAccepted) {
      return NextResponse.json({ error: 'Revisa los campos obligatorios y la aceptación de privacidad.' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    const priceId = session.line_items?.data[0]?.price?.id;
    const customerEmail = session.customer_details?.email || session.customer_email;

    if (session.payment_status !== 'paid' || priceId !== STRIPE_PRICE_IDS.ASESORIA_90M || !customerEmail) {
      return NextResponse.json({ error: 'No se ha podido verificar una reserva pagada para este formulario.' }, { status: 403 });
    }

    if (session.metadata?.intake_submitted === 'true') {
      return NextResponse.json({ success: true, alreadySubmitted: true });
    }

    const reference = session.id.slice(-10);
    const adminEmail = await sendDirectBrevoEmail({
      to: [{ email: ADMIN_EMAIL, name: 'Alberto Martín' }],
      replyTo: { email: customerEmail, name },
      subject: `Formulario recibido — ${name} · Asesoría IA 1:1`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#172018;line-height:1.65">
          <h1 style="font-size:28px;line-height:1.2">Nuevo formulario de asesoría 1:1</h1>
          <p><strong>Referencia:</strong> ${html(reference)}</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #ddd"><strong>Nombre</strong></td><td style="padding:10px 0;border-bottom:1px solid #ddd">${html(name)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #ddd"><strong>Email</strong></td><td style="padding:10px 0;border-bottom:1px solid #ddd">${html(customerEmail)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #ddd"><strong>Actividad</strong></td><td style="padding:10px 0;border-bottom:1px solid #ddd">${html(activity)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #ddd"><strong>Web / perfil</strong></td><td style="padding:10px 0;border-bottom:1px solid #ddd">${html(website || 'No indicado')}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #ddd"><strong>Nivel</strong></td><td style="padding:10px 0;border-bottom:1px solid #ddd">${html(experience)}</td></tr>
          </table>
          <h2 style="margin-top:28px">Problema prioritario</h2><p>${html(priority)}</p>
          <h2>Herramientas actuales</h2><p>${html(tools || 'No indicadas')}</p>
          <h2>Disponibilidad propuesta</h2><p>${html(availability)}</p>
          <h2>Contexto adicional</h2><p>${html(context || 'Sin información adicional')}</p>
          <p style="margin-top:28px"><a href="mailto:${html(customerEmail)}" style="background:#ff5a2a;color:#171612;text-decoration:none;padding:13px 20px;font-weight:bold">Responder y confirmar fecha</a></p>
        </div>`,
    });

    if (!adminEmail.success) {
      console.error('Error enviando intake a Alberto:', adminEmail.error);
      return NextResponse.json({ error: 'El formulario no pudo confirmarse por email. Inténtalo de nuevo.' }, { status: 502 });
    }

    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        intake_submitted: 'true',
        intake_submitted_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error en /api/asesoria/intake:', message);
    return NextResponse.json({ error: 'No se pudo procesar el formulario.' }, { status: 500 });
  }
}

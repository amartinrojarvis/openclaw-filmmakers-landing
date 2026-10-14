import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const BREVO_URL = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
const REDIRECTION_URL = 'https://www.iaparafilmmakers.es/casos-de-uso-vibe-coding?alta=ok';

function isValidEmail(email: string): boolean {
  if (email.length < 3 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`newsletter:${getClientIp(request)}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un minuto y vuelve a probar.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'No he podido leer el formulario. Vuelve a intentarlo.' },
      { status: 400 },
    );
  }

  const record = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const honeypot = typeof record.honeypot === 'string' ? record.honeypot : '';
  if (honeypot.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof record.email === 'string' ? record.email.trim() : '';
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Escribe un email válido.' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'La newsletter no está disponible: falta BREVO_API_KEY.' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(BREVO_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [18],
        templateId: 27,
        redirectionUrl: REDIRECTION_URL,
      }),
    });

    if (response.status === 201 || response.status === 204) {
      return NextResponse.json({ ok: true });
    }
  } catch {
    return NextResponse.json(
      { error: 'No he podido apuntarte. Prueba de nuevo en unos minutos.' },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { error: 'No he podido apuntarte. Prueba de nuevo en unos minutos.' },
    { status: 502 },
  );
}

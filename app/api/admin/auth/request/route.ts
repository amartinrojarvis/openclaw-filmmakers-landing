import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAIL, createMagicLinkToken } from '@/lib/admin-auth-token';
import { getAdminSessionSecret, getTrustedAdminOrigin } from '@/lib/admin-auth';
import { ADMIN_PRODUCTION_ORIGIN } from '@/lib/admin-origin';
import { sendDirectBrevoEmail } from '@/lib/brevo';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const trustedOrigin = getTrustedAdminOrigin(request);
  if (!trustedOrigin) return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 });
  const limit = rateLimit(`admin-magic-link:${getClientIp(request)}`, 3, 15 * 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera unos minutos.' }, { status: 429 });
  }

  try {
    const token = createMagicLinkToken(getAdminSessionSecret());
    const linkOrigin = process.env.VERCEL_ENV === 'production'
      ? ADMIN_PRODUCTION_ORIGIN
      : trustedOrigin;
    const accessUrl = new URL('/api/admin/auth/verify', linkOrigin);
    accessUrl.searchParams.set('token', token);
    const sent = await sendDirectBrevoEmail({
      to: [{ email: ADMIN_EMAIL, name: 'Alberto Martín' }],
      subject: 'Tu acceso privado · Alumnos IA para Filmmakers',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#171612;line-height:1.65">
          <p style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#ff5a2a;font-weight:700">IA para Filmmakers · acceso privado</p>
          <h1 style="font-size:30px;line-height:1.15">Abrir el panel de alumnos</h1>
          <p>Este enlace permite acceder al panel privado de alumnos y caduca en 15 minutos.</p>
          <p style="margin:30px 0"><a href="${accessUrl.toString()}" style="display:inline-block;background:#ff5a2a;color:#171612;text-decoration:none;padding:15px 22px;font-weight:800">Entrar al panel</a></p>
          <p style="font-size:13px;color:#666">Si no has solicitado este acceso, puedes ignorar el mensaje.</p>
        </div>`,
    });
    if (!sent.success) throw new Error(sent.error || 'No se pudo enviar el enlace');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin magic link request failed:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'No se pudo enviar el enlace de acceso.' }, { status: 502 });
  }
}

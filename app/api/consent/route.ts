import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const CONSENT_VERSION = '2026-07-v2';
const CONSENT_MAX_AGE_DAYS = 180;
const PROOF_COOKIE = 'iapf_consent_proof';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`consent:${ip}`, 12, 60_000);
    if (!limit.success) return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 });

    const raw = await request.text();
    if (raw.length > 4_096) return NextResponse.json({ error: 'Solicitud demasiado grande' }, { status: 413 });
    const body = JSON.parse(raw) as Record<string, unknown>;
    const { necessary, analytics, marketing, timestamp, expiresAt, version, consentId } = body;

    const timestampMs = typeof timestamp === 'string' ? Date.parse(timestamp) : NaN;
    const expiresMs = typeof expiresAt === 'string' ? Date.parse(expiresAt) : NaN;
    const valid = necessary === true
      && typeof analytics === 'boolean'
      && typeof marketing === 'boolean'
      && version === CONSENT_VERSION
      && typeof consentId === 'string'
      && /^[a-zA-Z0-9-]{12,80}$/.test(consentId)
      && Number.isFinite(timestampMs)
      && Number.isFinite(expiresMs)
      && Math.abs(Date.now() - timestampMs) < 10 * 60_000
      && expiresMs > Date.now();

    if (!valid) return NextResponse.json({ error: 'Formato de consentimiento inválido' }, { status: 400 });

    const proof = Buffer.from(JSON.stringify({
      consentId,
      necessary: true,
      analytics,
      marketing,
      timestamp,
      expiresAt,
      version,
    })).toString('base64url');

    const response = NextResponse.json({ success: true, consentId });
    response.cookies.set(PROOF_COOKIE, proof, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: CONSENT_MAX_AGE_DAYS * 24 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
}

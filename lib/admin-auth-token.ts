import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ADMIN_EMAIL = 'a.martinro@gmail.com';
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
export const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export type AdminTokenPurpose = 'magic-link' | 'admin-session';

export interface AdminTokenPayload {
  email: string;
  purpose: AdminTokenPurpose;
  iat: number;
  exp: number;
  nonce: string;
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function encode(payload: AdminTokenPayload, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

function decode(token: string, secret: string, purpose: AdminTokenPurpose, now: number): AdminTokenPayload | null {
  try {
    const [encodedPayload, providedSignature, extra] = token.split('.');
    if (!encodedPayload || !providedSignature || extra) return null;
    const expectedSignature = sign(encodedPayload, secret);
    const provided = Buffer.from(providedSignature, 'utf8');
    const expected = Buffer.from(expectedSignature, 'utf8');
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as Partial<AdminTokenPayload>;
    if (
      payload.email !== ADMIN_EMAIL
      || payload.purpose !== purpose
      || !Number.isFinite(payload.iat)
      || !Number.isFinite(payload.exp)
      || typeof payload.nonce !== 'string'
      || payload.nonce.length < 8
      || now > Number(payload.exp)
      || Number(payload.iat) > now + 60_000
    ) return null;

    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function createMagicLinkToken(secret: string, now: number = Date.now(), nonce: string = randomBytes(18).toString('base64url')): string {
  return encode({ email: ADMIN_EMAIL, purpose: 'magic-link', iat: now, exp: now + MAGIC_LINK_TTL_MS, nonce }, secret);
}

export function verifyMagicLinkToken(token: string, secret: string, now: number = Date.now()): AdminTokenPayload | null {
  return decode(token, secret, 'magic-link', now);
}

export function createAdminSessionToken(secret: string, now: number = Date.now()): string {
  return encode({
    email: ADMIN_EMAIL,
    purpose: 'admin-session',
    iat: now,
    exp: now + ADMIN_SESSION_TTL_MS,
    nonce: randomBytes(18).toString('base64url'),
  }, secret);
}

export function verifyAdminSessionToken(token: string, secret: string, now: number = Date.now()): AdminTokenPayload | null {
  return decode(token, secret, 'admin-session', now);
}

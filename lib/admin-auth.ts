import 'server-only';

import { cookies } from 'next/headers';
import { verifyAdminSessionToken } from './admin-auth-token';
import { resolveTrustedAdminOrigin } from './admin-origin';

export const ADMIN_COOKIE_NAME = 'iapf_admin_session';

export function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  if (secret.length < 32) throw new Error('ADMIN_SESSION_SECRET debe tener al menos 32 caracteres');
  return secret;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    return Boolean(verifyAdminSessionToken(token, getAdminSessionSecret()));
  } catch {
    return false;
  }
}

export function getTrustedAdminOrigin(request: Request): string | null {
  return resolveTrustedAdminOrigin(
    request.url,
    request.headers.get('origin'),
    process.env.VERCEL_ENV,
  );
}

export function isSameOrigin(request: Request): boolean {
  return Boolean(getTrustedAdminOrigin(request));
}

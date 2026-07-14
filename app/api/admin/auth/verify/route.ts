import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getAdminSessionSecret } from '@/lib/admin-auth';
import {
  ADMIN_SESSION_TTL_MS,
  createAdminSessionToken,
  verifyMagicLinkToken,
} from '@/lib/admin-auth-token';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  let valid = false;
  try {
    valid = token.length < 2048 && Boolean(verifyMagicLinkToken(token, getAdminSessionSecret()));
  } catch {
    valid = false;
  }

  const destination = new URL('/admin/alumnos', request.url);
  if (!valid) destination.searchParams.set('auth', 'invalid');
  const response = NextResponse.redirect(destination);
  response.headers.set('Cache-Control', 'no-store, private');
  if (valid) {
    response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(getAdminSessionSecret()), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
      path: '/',
    });
  }
  return response;
}

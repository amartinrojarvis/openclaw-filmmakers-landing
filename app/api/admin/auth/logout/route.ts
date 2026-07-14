import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isSameOrigin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 });
  const response = NextResponse.redirect(new URL('/admin/alumnos', request.url), 303);
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
  return response;
}

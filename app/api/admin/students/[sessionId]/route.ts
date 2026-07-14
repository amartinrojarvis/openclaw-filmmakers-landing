import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated, isSameOrigin } from '@/lib/admin-auth';
import { updateIafPurchase } from '@/lib/admin-students-stripe';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type Context = { params: Promise<{ sessionId: string }> };

function field(form: FormData, key: string, max: number): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: NextRequest, context: Context) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 });
  const limit = rateLimit(`admin-student-update:${getClientIp(request)}`, 20, 60_000);
  if (!limit.success) return NextResponse.json({ error: 'Demasiados cambios. Espera un minuto.' }, { status: 429 });

  const destination = new URL('/admin/alumnos', request.url);
  try {
    const { sessionId } = await context.params;
    const form = await request.formData();
    await updateIafPurchase(sessionId, {
      serviceStart: field(form, 'serviceStart', 10),
      serviceEnd: field(form, 'serviceEnd', 10),
      status: field(form, 'status', 20) || 'pending',
      note: field(form, 'note', 500),
    });
    revalidatePath('/admin/alumnos');
    destination.searchParams.set('updated', '1');
  } catch (error) {
    console.error('Admin student update failed:', error instanceof Error ? error.message : String(error));
    destination.searchParams.set('error', 'update');
  }
  return NextResponse.redirect(destination, 303);
}

// API Route: Suscribir email a Kit (captura de leads)
// POST /api/kit/subscribe

import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, KIT_TAGS } from '@/lib/kit';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

interface SubscribeRequest {
  email: string;
  firstName?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting: max 3 requests por IP cada 60 segundos
    const ip = getClientIp(request);
    const limit = rateLimit(`kit-subscribe:${ip}`, 3, 60_000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentalo de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const body: SubscribeRequest = await request.json();
    const { email, firstName } = body;

    // Validaciones
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      );
    }

    // Añadir a Kit con tag 'lead'
    const result = await addSubscriber(email, [KIT_TAGS.LEAD]);

    if (result.success) {
      console.log(`Lead capturado: ${email}`);
      
      return NextResponse.json({
        success: true,
        message: 'Suscripción exitosa',
        subscriberId: result.subscriber?.id,
      });
    } else {
      console.error('Error capturando lead:', result.error);
      
      return NextResponse.json(
        { error: result.error || 'Error al suscribir' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error en /api/kit/subscribe:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { error: 'Error interno', details: errorMessage },
      { status: 500 }
    );
  }
}

// API Route: Suscribir email a Kit (captura de leads)
// POST /api/kit/subscribe

import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, KIT_TAGS } from '@/lib/kit';

interface SubscribeRequest {
  email: string;
  firstName?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

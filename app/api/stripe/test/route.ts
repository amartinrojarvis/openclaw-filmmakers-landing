// API Route: Test simple de Stripe
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY no configurada' },
        { status: 500 }
      );
    }

    // Test simple con fetch nativo
    const response = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Stripe API error', details: error },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      account: data.id,
      email: data.email,
      message: 'Conexión a Stripe exitosa',
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error de conexión', details: errorMessage },
      { status: 500 }
    );
  }
}

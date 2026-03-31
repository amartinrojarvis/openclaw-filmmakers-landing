// API Route: Crear sesión de checkout de Stripe usando fetch nativo
// POST /api/stripe/checkout

import { NextRequest, NextResponse } from 'next/server';
import { STRIPE_PRICE_IDS } from '@/lib/stripe';

interface CheckoutRequest {
  priceId: string;
  email?: string;
}

const STRIPE_API_URL = 'https://api.stripe.com/v1';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CheckoutRequest = await request.json();
    const { priceId, email } = body;

    // Validaciones
    if (!priceId) {
      return NextResponse.json(
        { error: 'priceId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el priceId sea válido
    const validPriceIds = Object.values(STRIPE_PRICE_IDS).filter(Boolean);
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'priceId no válido' },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY no configurada' },
        { status: 500 }
      );
    }

    const siteUrl = 'https://www.iaparafilmmakers.es';

    // Crear sesión de checkout usando fetch nativo
    const params = new URLSearchParams({
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'billing_address_collection': 'required',
      'success_url': `${siteUrl}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${siteUrl}/`,
      'metadata[priceId]': priceId,
      'metadata[source]': 'landing_page',
    });

    // Agregar email si se proporcionó
    if (email) {
      params.append('customer_email', email);
    }

    const response = await fetch(`${STRIPE_API_URL}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stripe API error:', errorData);
      return NextResponse.json(
        { error: 'Error de Stripe', details: errorData.error?.message || 'Error desconocido' },
        { status: 500 }
      );
    }

    const session = await response.json();

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creando sesión de checkout:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { error: 'Error creando sesión de checkout', details: errorMessage },
      { status: 500 }
    );
  }
}

// API Route: Checkout del Bundle con descuento pre-aplicado
// GET /api/stripe/bundle-discount
// Redirige automáticamente al checkout de Stripe con 30€ de descuento aplicado

import { NextRequest, NextResponse } from 'next/server';
import { STRIPE_PRICE_IDS } from '@/lib/stripe';

const STRIPE_API_URL = 'https://api.stripe.com/v1';
const PROMO_CODE_ID = 'promo_1TN7ucHBqq0IP9Ia5asBEe2P'; // UPGRADE97

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY no configurada' },
        { status: 500 }
      );
    }

    const siteUrl = 'https://www.iaparafilmmakers.es';
    const priceId = STRIPE_PRICE_IDS.BUNDLE;

    // Crear sesión de checkout con descuento pre-aplicado
    const params = new URLSearchParams({
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'billing_address_collection': 'required',
      'discounts[0][promotion_code]': PROMO_CODE_ID,
      'success_url': `${siteUrl}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${siteUrl}/`,
      'metadata[priceId]': priceId,
      'metadata[source]': 'bundle_discount_link',
      'metadata[coupon_code]': 'UPGRADE97',
    });

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

    // Redirigir al checkout de Stripe
    return NextResponse.redirect(session.url, 303);

  } catch (error) {
    console.error('Error creando sesión de checkout con descuento:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { error: 'Error creando sesión de checkout', details: errorMessage },
      { status: 500 }
    );
  }
}

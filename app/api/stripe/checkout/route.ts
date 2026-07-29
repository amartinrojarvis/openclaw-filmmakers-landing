// API Route: Crear sesión de checkout de Stripe usando fetch nativo
// POST /api/stripe/checkout

import { NextRequest, NextResponse } from 'next/server';
import { isAdvisoryBasePriceId, STRIPE_PRICE_IDS } from '@/lib/stripe';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

interface CheckoutRequest {
  priceId: string;
  email?: string;
  promotionCode?: string; // Código promocional pre-aplicado (opcional)
}

const STRIPE_API_URL = 'https://api.stripe.com/v1';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting: max 5 requests por IP cada 60 segundos
    const ip = getClientIp(request);
    const limit = rateLimit(`stripe-checkout:${ip}`, 5, 60_000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentalo de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const body: CheckoutRequest = await request.json();
    const { priceId, email, promotionCode } = body;

    // Validaciones
    if (!priceId) {
      return NextResponse.json(
        { error: 'priceId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el priceId sea válido
    const validPriceIds = new Set<string>([
      STRIPE_PRICE_IDS.GUIA,
      STRIPE_PRICE_IDS.BUNDLE,
      STRIPE_PRICE_IDS.ASESORIA_90M,
    ]);
    if (!validPriceIds.has(priceId)) {
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iaparafilmmakers.es';
    const isAdvisory = isAdvisoryBasePriceId(priceId);
    const successPath = isAdvisory ? '/gracias-asesoria' : '/gracias';

    // Crear sesión de checkout usando fetch nativo.
    // Los precios de asesoría son inclusivos: Automatic Tax desglosa el impuesto cuando corresponda sin subir el total.
    const params = new URLSearchParams({
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'billing_address_collection': 'required',
      'tax_id_collection[enabled]': 'true',
      'automatic_tax[enabled]': 'true',
      'customer_creation': 'always',
      'locale': 'es',
      'success_url': `${siteUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${siteUrl}/#sesion`,
      'metadata[priceId]': priceId,
      'metadata[source]': isAdvisory ? 'landing_asesoria_1a1' : 'landing_page',
      'metadata[product_type]': isAdvisory ? 'asesoria_90m' : 'producto_digital',
    });

    if (isAdvisory) {
      params.append('submit_type', 'book');
    }

    // Los códigos se mantienen en los productos digitales anteriores; la edición piloto no admite descuentos.
    if (!isAdvisory) {
      if (promotionCode) {
        params.append('discounts[0][promotion_code]', promotionCode);
      } else {
        params.append('allow_promotion_codes', 'true');
      }
    }

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

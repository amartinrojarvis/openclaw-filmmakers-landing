// Endpoint para testear el webhook con datos reales
import { NextRequest, NextResponse } from 'next/server';
import { sendGuiaEmail, sendBundleEmail } from '@/lib/brevo';
import { getProductTypeFromPriceId, STRIPE_PRICE_IDS } from '@/lib/stripe';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, priceId } = await request.json();
    
    console.log('=== TEST WEBHOOK SIMULATION ===');
    console.log('Email:', email);
    console.log('PriceId:', priceId);
    console.log('STRIPE_PRICE_IDS:', STRIPE_PRICE_IDS);
    
    if (!email || !priceId) {
      return NextResponse.json({ 
        error: 'Email y priceId requeridos',
        received: { email, priceId }
      }, { status: 400 });
    }
    
    // Verificar si el priceId es válido
    const productType = getProductTypeFromPriceId(priceId);
    console.log('Product type:', productType);
    
    if (!productType) {
      return NextResponse.json({
        error: 'PriceId no reconocido',
        priceId,
        validGuia: priceId === STRIPE_PRICE_IDS.GUIA,
        validBundle: priceId === STRIPE_PRICE_IDS.BUNDLE,
        expectedGuia: STRIPE_PRICE_IDS.GUIA,
        expectedBundle: STRIPE_PRICE_IDS.BUNDLE,
      }, { status: 400 });
    }
    
    // Enviar email
    let result;
    if (productType === 'bundle') {
      console.log('Enviando email de bundle...');
      result = await sendBundleEmail(email);
    } else {
      console.log('Enviando email de guia...');
      result = await sendGuiaEmail(email);
    }
    
    console.log('Resultado:', result);
    
    return NextResponse.json({
      success: result.success,
      productType,
      email,
      priceId,
      error: result.error
    });
    
  } catch (error) {
    console.error('Error en test-webhook:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Endpoint de test para webhook',
    priceIds: STRIPE_PRICE_IDS
  });
}

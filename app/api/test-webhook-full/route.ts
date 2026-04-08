// Endpoint para probar el flujo completo del webhook sin hacer una compra real
import { NextRequest, NextResponse } from 'next/server';
import { getProductTypeFromPriceId, STRIPE_PRICE_IDS } from '@/lib/stripe';
import { sendGuiaEmail, sendBundleEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  console.log('=== TEST WEBHOOK FULL ===');
  
  const body = await request.json();
  const { email, product } = body;
  
  console.log('Email:', email);
  console.log('Producto:', product);
  
  // Simular el price_id según el producto
  const priceId = product === 'bundle' ? STRIPE_PRICE_IDS.BUNDLE : STRIPE_PRICE_IDS.GUIA;
  console.log('Price ID:', priceId);
  
  // Determinar tipo de producto (igual que en el webhook real)
  const productType = getProductTypeFromPriceId(priceId);
  console.log('Product type:', productType);
  
  if (!productType) {
    return NextResponse.json({
      success: false,
      error: 'Producto desconocido',
      priceId,
      guiaId: STRIPE_PRICE_IDS.GUIA,
      bundleId: STRIPE_PRICE_IDS.BUNDLE,
    }, { status: 400 });
  }
  
  // Enviar email (igual que en el webhook real)
  let emailResult;
  try {
    if (productType === 'bundle') {
      console.log('Llamando sendBundleEmail...');
      emailResult = await sendBundleEmail(email);
    } else {
      console.log('Llamando sendGuiaEmail...');
      emailResult = await sendGuiaEmail(email);
    }
    console.log('Email result:', emailResult);
  } catch (err) {
    console.error('Exception:', err);
    emailResult = { success: false, error: String(err) };
  }
  
  return NextResponse.json({
    success: emailResult.success,
    productType,
    priceId,
    error: emailResult.error,
    env: {
      brevoKeyExists: !!process.env.BREVO_API_KEY,
      brevoKeyPrefix: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) + '...' : null,
    }
  });
}

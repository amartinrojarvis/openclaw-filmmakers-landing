// Script para crear cupón de descuento en Stripe
// Descuento: 30€ (de 127€ a 97€)

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ ERROR: STRIPE_SECRET_KEY no está configurada');
  console.error('Ejecuta: export STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const STRIPE_API_URL = 'https://api.stripe.com/v1';

async function createCoupon() {
  try {
    console.log('🎫 Creando cupón de descuento...');
    console.log('💰 Descuento: 30€ (de 127€ a 97€)');

    // Crear el cupón con descuento de 30€
    const couponParams = new URLSearchParams({
      'amount_off': '3000', // 30€ en céntimos
      'currency': 'eur',
      'name': 'Descuento Bundle Upgrade',
      'duration': 'once',
    });

    const couponResponse = await fetch(`${STRIPE_API_URL}/coupons`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: couponParams.toString(),
    });

    if (!couponResponse.ok) {
      const errorData = await couponResponse.json();
      console.error('❌ Error creando cupón:', errorData);
      process.exit(1);
    }

    const coupon = await couponResponse.json();
    console.log('✅ Cupón creado:', coupon.id);

    // Crear el código promocional
    const promoParams = new URLSearchParams({
      'coupon': coupon.id,
      'code': 'UPGRADE97',
      'max_redemptions': '100', // Límite de usos
    });

    const promoResponse = await fetch(`${STRIPE_API_URL}/promotion_codes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: promoParams.toString(),
    });

    if (!promoResponse.ok) {
      const errorData = await promoResponse.json();
      console.error('❌ Error creando código promocional:', errorData);
      process.exit(1);
    }

    const promoCode = await promoResponse.json();
    console.log('✅ Código promocional creado:', promoCode.code);
    console.log('');
    console.log('🎯 RESUMEN:');
    console.log('  Coupon ID:', coupon.id);
    console.log('  Código:', promoCode.code);
    console.log('  Descuento: 30€');
    console.log('  Precio final: 97€');
    console.log('');
    console.log('🔗 Link de checkout con descuento pre-aplicado:');
    console.log(`  https://checkout.stripe.com/c/pay/cs_test_... (generar vía API)`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createCoupon();

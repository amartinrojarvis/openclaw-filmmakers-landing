# Stripe setup - OpenClaw para Filmmakers

## Qué debe preparar Alberto en Stripe

### 1) Tipo de cuenta Stripe
Necesita una **cuenta Stripe estándar de negocio** (no personal), en modo normal de merchant para vender un producto digital propio.

Recomendación:
- Cuenta de empresa/autónomo verificada
- Moneda principal: **EUR**
- País fiscal correcto
- Nombre comercial y datos de facturación completos
- Activar **Stripe Checkout** y **Payment Links** / pagos online

Si va a vender desde España:
- Completar verificación KYC
- Datos fiscales del autónomo o sociedad
- Cuenta bancaria para recibir payouts

---

### 2) Qué claves/API keys necesitamos
Para una integración simple en Next.js + Vercel:

#### Obligatorias
- **STRIPE_SECRET_KEY**
  - Empieza por `sk_live_...` en producción
  - Empieza por `sk_test_...` en pruebas
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
  - Empieza por `pk_live_...` en producción
  - Empieza por `pk_test_...` en pruebas
- **STRIPE_WEBHOOK_SECRET**
  - Empieza por `whsec_...`
  - Sale al crear el endpoint webhook

#### Muy recomendables
- **STRIPE_PRICE_ID_GUIDE**
  - ID del precio del producto principal de **€29**
  - Formato: `price_...`
- **STRIPE_PRODUCT_ID_GUIDE**
  - ID del producto principal
  - Formato: `prod_...`
- **STRIPE_SUCCESS_URL**
  - URL tras pago correcto
- **STRIPE_CANCEL_URL**
  - URL si cancela checkout

#### Opcionales si luego ampliamos
- **STRIPE_PRICE_ID_GUIDE_PRO** para una upsell / versión premium
- **STRIPE_CUSTOMER_PORTAL_RETURN_URL** si se habilita portal de cliente

---

### 3) Producto y precio que debe crear
Crear en Stripe:

#### Producto principal
- Nombre: **OpenClaw para Filmmakers**
- Tipo: **one-time payment**
- Precio: **€29**
- Moneda: **EUR**
- Descripción breve:
  - Guía práctica para automatizar agenda, clientes, emails y operaciones con OpenClaw

#### Opcional más adelante
- Producto upsell: consultoría 1:1
- Precio premium o bundle

Importante:
- Si el producto es digital descargable, definir bien el fulfillment post-pago
- Si habrá IVA/Tax, activar **Stripe Tax** o dejar configurado manualmente según fiscalidad real

---

### 4) Webhooks necesarios
Para una primera versión sólida, necesitamos mínimo estos eventos:

#### Imprescindible
- `checkout.session.completed`
  - Confirmar compra
  - Disparar entrega del producto / acceso / email

#### Recomendados
- `payment_intent.succeeded`
  - Confirmación adicional del pago
- `payment_intent.payment_failed`
  - Detectar fallo de pago
- `checkout.session.expired`
  - Saber cuándo un checkout no terminó

#### Si luego usamos invoices/subscriptions
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

### 5) Endpoint webhook esperado en Vercel
Recomendado:
- Producción: `https://TU-DOMINIO.com/api/stripe/webhook`
- Preview/draft: `https://TU-PROYECTO.vercel.app/api/stripe/webhook`

Importante:
- El webhook de producción debe apuntar al dominio final
- El secreto `whsec_...` cambia por endpoint; no reutilizar si crea otro distinto

---

### 6) Variables de entorno para Vercel
Añadir en Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID_GUIDE=price_xxxxx
STRIPE_PRODUCT_ID_GUIDE=prod_xxxxx
STRIPE_SUCCESS_URL=https://tu-dominio.com/gracias
STRIPE_CANCEL_URL=https://tu-dominio.com/
```

Para preview/test:

```env
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID_GUIDE=price_xxxxx
STRIPE_PRODUCT_ID_GUIDE=prod_xxxxx
STRIPE_SUCCESS_URL=https://tu-proyecto.vercel.app/gracias
STRIPE_CANCEL_URL=https://tu-proyecto.vercel.app/
```

---

## Paso a paso exacto para Alberto

### Fase 1 - Cuenta
1. Entrar en Stripe Dashboard
2. Crear o validar cuenta de negocio
3. Completar verificación fiscal y bancaria
4. Confirmar que la moneda principal será EUR

### Fase 2 - Producto
5. Ir a **Product catalog**
6. Crear producto: **OpenClaw para Filmmakers**
7. Crear precio único de **€29**
8. Guardar y copiar:
   - `prod_...`
   - `price_...`

### Fase 3 - Claves API
9. Ir a **Developers > API keys**
10. Copiar:
    - Publishable key `pk_...`
    - Secret key `sk_...`
11. Guardarlas para Vercel

### Fase 4 - Webhook
12. Ir a **Developers > Webhooks**
13. Crear endpoint: `/api/stripe/webhook`
14. Seleccionar eventos:
    - `checkout.session.completed`
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`
    - `checkout.session.expired`
15. Guardar y copiar el secreto `whsec_...`

### Fase 5 - Vercel
16. Abrir el proyecto en Vercel
17. Añadir todas las variables de entorno
18. Separar variables de `Preview` y `Production`
19. Hacer redeploy

### Fase 6 - Validación
20. Hacer compra de prueba en modo test
21. Verificar que el webhook recibe el evento
22. Verificar redirección a página de gracias
23. Verificar entrega del producto / email / acceso
24. Cambiar a live solo cuando test esté OK

---

## Recomendación técnica para esta landing
La forma más rápida y robusta para salir hoy es:

### Opción recomendada
- **Stripe Checkout alojado por Stripe**
- Un solo producto de **€29**
- Botón CTA que llama a un endpoint en Next.js y redirige al checkout
- Webhook para confirmar pago

Ventajas:
- Menos fricción
- Menos riesgo técnico
- Más rápido para tener draft en Vercel
- Menos superficie de error legal/técnico

---

## Qué NO hace falta preparar ahora
No hace falta todavía:
- Stripe Connect
- Suscripciones
- Marketplace
- Split payments
- Apple Pay/Google Pay manualmente (Checkout los soporta si Stripe lo permite)
- Portal de cliente complejo

---

## Checklist final para Alberto
- [ ] Cuenta Stripe de negocio verificada
- [ ] Producto creado: OpenClaw para Filmmakers
- [ ] Precio creado: €29 one-time
- [ ] `pk_...` disponible
- [ ] `sk_...` disponible
- [ ] `price_...` copiado
- [ ] `prod_...` copiado
- [ ] Webhook creado
- [ ] `whsec_...` copiado
- [ ] Variables puestas en Vercel
- [ ] Compra test validada

---

## Nota para desarrollo
Con esto preparado, la integración de checkout en la landing se puede cerrar muy rápido sin rehacer arquitectura.
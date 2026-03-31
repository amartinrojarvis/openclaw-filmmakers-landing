# Guía de Testing - Stripe + Kit Integration

Esta guía explica cómo testear el flujo completo de pagos y captura de leads.

---

## 📋 Requisitos Previos

1. **Stripe CLI** instalado (para testing local del webhook)
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
   echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
   sudo apt update
   sudo apt install stripe
   ```

2. **Variables de entorno configuradas** en `.env.local`

3. **Productos creados en Stripe Dashboard** (modo test)

---

## 🚀 Paso 1: Crear Productos en Stripe (Test Mode)

1. Ve a https://dashboard.stripe.com/test/products
2. Crea el Producto 1:
   - Nombre: "Guía OpenClaw para Filmmakers"
   - Precio: €29
   - Tipo: One-time
   - Guarda el `price_id` (formato: `price_xxxxx`)

3. Crea el Producto 2:
   - Nombre: "Guía + Sesión 1:1"
   - Precio: €127
   - Tipo: One-time
   - Guarda el `price_id` (formato: `price_xxxxx`)

4. Actualiza `.env.local` con los price IDs obtenidos:
   ```env
   STRIPE_PRICE_ID_GUIA=price_tu_id_aqui
   STRIPE_PRICE_ID_BUNDLE=price_tu_id_aqui
   ```

---

## 🧪 Paso 2: Configurar Webhook Local

### Opción A: Usando Stripe CLI (Recomendado)

1. Login en Stripe CLI:
   ```bash
   stripe login
   ```

2. Iniciar el forwarding del webhook:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Copiar el **Signing secret** que aparece (ej: `whsec_xxxxx`)

4. Actualizar `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_tu_secreto_aqui
   ```

### Opción B: Usando Stripe Dashboard (para producción)

1. Ve a https://dashboard.stripe.com/test/webhooks
2. Crear endpoint:
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copiar el secreto y añadirlo a las variables de entorno

---

## 📝 Paso 3: Testear Captura de Leads (Kit)

### Test con curl:

```bash
curl -X POST http://localhost:3000/api/kit/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@ejemplo.com"}'
```

### Respuesta esperada:
```json
{
  "success": true,
  "message": "Suscripción exitosa",
  "subscriberId": "12345"
}
```

### Verificar en Kit:
1. Ve a https://app.kit.com/subscribers
2. Busca el email `test@ejemplo.com`
3. Verifica que tenga el tag `lead`

---

## 💳 Paso 4: Testear Checkout de Stripe

### Test con curl:

```bash
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_tu_id_de_guia",
    "email": "cliente@test.com"
  }'
```

### Respuesta esperada:
```json
{
  "sessionId": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxxxx"
}
```

### Flujo completo de compra:

1. **Abrir la URL** devuelta en el navegador

2. **Usar datos de prueba de Stripe:**
   - Email: cualquiera
   - Número de tarjeta: `4242 4242 4242 4242`
   - Fecha: cualquier fecha futura (ej: 12/25)
   - CVC: cualquier número de 3 dígitos (ej: 123)
   - ZIP: cualquier código postal

3. **Completar la compra**

4. **Verificar redirección:** Debe llevar a `/gracias?session_id=cs_test_xxxxx`

5. **Verificar logs:** En la terminal del Stripe CLI deberías ver:
   ```
   checkout.session.completed
   ```

6. **Verificar en Kit:** El email del cliente debe aparecer con tag `compro-guia`

---

## 🔍 Paso 5: Testear Webhook

### Simular evento con Stripe CLI:

```bash
stripe trigger checkout.session.completed
```

Esto simulará un evento completo de checkout y lo enviará a tu webhook local.

### Ver logs de tu aplicación:

Deberías ver en la consola del servidor Next.js:
```
Checkout completado: cs_test_xxxxx
Cliente test@example.com compró: guia
Suscriptor añadido a Kit: test@example.com con tags: compro-guia
📧 Enviando email a test@example.com:
   - Adjunto: Guía OpenClaw para Filmmakers (PDF)
```

---

## 🧪 Tarjetas de Prueba de Stripe

| Tipo | Número | Descripción |
|------|--------|-------------|
| Éxito | `4242 4242 4242 4242` | Pago exitoso |
| Rechazado | `4000 0000 0000 0002` | Tarjeta rechazada |
| Autenticación | `4000 0025 0000 3155` | Requiere 3D Secure |
| Sin fondos | `4000 0000 0000 9995` | Fondos insuficientes |

Más tarjetas: https://stripe.com/docs/testing#cards

---

## 📁 Archivos Creados

```
projects/openclaw-filmmakers-landing/
├── .env.local                              # Variables de entorno
├── app/
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts          # POST: Crear sesión checkout
│   │   │   └── webhook/route.ts           # POST: Recibir webhooks
│   │   └── kit/
│   │       └── subscribe/route.ts         # POST: Capturar leads
│   └── gracias/page.tsx                   # Página post-compra
├── lib/
│   ├── kit.ts                             # Helper Kit API
│   └── stripe.ts                          # Cliente Stripe
└── TESTING.md                             # Esta guía
```

---

## 🚀 Deploy a Producción

### Variables de entorno en Vercel:

```env
# Stripe (modo producción)
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID_GUIA=price_live_xxxxx
STRIPE_PRICE_ID_BUNDLE=price_live_xxxxx

# Kit
KIT_API_KEY=kit_xxxxx

# Site
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### Configurar Webhook de Producción:

1. Ve a https://dashboard.stripe.com/webhooks
2. Crear endpoint:
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`
3. Guardar el secreto en Vercel

---

## ⚠️ Solución de Problemas

### "No signature found"
- Asegúrate de que el webhook está configurado correctamente
- Usa Stripe CLI para desarrollo local

### "Invalid signature"
- El `STRIPE_WEBHOOK_SECRET` no coincide
- Regenera el secreto en Stripe Dashboard

### "KIT_API_KEY no configurada"
- Verifica que existe en `.env.local`
- Reinicia el servidor Next.js después de cambiar variables

### "priceId no válido"
- Asegúrate de usar el ID del precio (`price_xxxxx`), no del producto (`prod_xxxxx`)
- Verifica que estás en modo test si usas claves de test

---

## 📞 Soporte

- Stripe Docs: https://stripe.com/docs
- Kit API: https://developers.kit.com/
- Problemas? Revisa los logs del servidor y del Stripe CLI

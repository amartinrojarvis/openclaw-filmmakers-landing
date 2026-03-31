# OpenClaw para Filmmakers

Landing page de venta para el producto digital **"OpenClaw para Filmmakers"**.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Deploy en Vercel

## Estado actual
- Landing responsive mobile-first
- SEO básico configurado en `app/layout.tsx`
- CTA provisional por email
- Preparada para sustituir el CTA por Stripe
- Placeholders visuales para logo/mockups

---

## Desarrollo local

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
```

---

## Qué debe preparar Alberto para Stripe

### Opción recomendada para salir rápido
**Stripe Payment Link** si quiere vender cuanto antes sin backend adicional.

### Opción recomendada para control total
**Stripe Checkout Session** si quiere más control, webhooks y automatizaciones posteriores.

---

## Checklist exacta para Alberto

### 1) Crear o tener lista la cuenta de Stripe
- Acceder a https://dashboard.stripe.com/
- Completar datos de negocio
- Verificar identidad/fiscalidad si Stripe lo pide
- Configurar cuenta bancaria para recibir pagos

### 2) Crear el producto principal
En Stripe:
- Ir a **Product catalog** / **Productos**
- Crear producto: `OpenClaw para Filmmakers - PDF Guía`
- Crear precio único:
  - **Importe:** `29 EUR`
  - **Tipo:** pago único

Si también quiere vender la opción premium:
- Producto: `OpenClaw para Filmmakers - PDF + Consultoría 30min`
- Precio único: `99 EUR`

### 3) Decidir método de cobro

#### A. Método más rápido: Payment Link
Ideal si solo quiere conectar el botón y vender ya.

Debe hacer esto:
- Crear un **Payment Link** para el producto de 29€
- Copiar la URL pública del Payment Link
- Sustituir el href del botón principal por esa URL

**Dónde tocar en el código:**
- Archivo: `app/page.tsx`
- Buscar el CTA final y/o CTAs de oferta
- Sustituir el `href="mailto:..."` por la URL del Payment Link

#### B. Método más sólido: Stripe Checkout Session
Ideal si quiere backend, control, tracking y automatizaciones.

Necesitará:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` *(solo si usa frontend con Stripe.js; para redirect server-side puede no hacer falta al inicio)*
- `STRIPE_PRICE_ID_PDF`
- opcional: `STRIPE_PRICE_ID_CONSULTORIA`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

---

## Variables de entorno que Alberto debe configurar

En **Vercel > Project > Settings > Environment Variables**:

```env
NEXT_PUBLIC_SITE_URL=https://TU-DOMINIO-REAL.com
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_PRICE_ID_PDF=price_xxx
STRIPE_PRICE_ID_CONSULTORIA=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Notas
- En staging puede usar claves `test`
- En producción debe usar claves `live`
- No subir nunca la secret key a GitHub

---

## Configuración de webhook en Stripe

Si usa Checkout Session, Alberto debe crear un webhook.

### Endpoint sugerido
Cuando se implemente backend, el endpoint típico sería algo como:

```txt
https://TU-DOMINIO-REAL.com/api/stripe/webhook
```

### Eventos recomendados
Activar como mínimo:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### Para qué sirve
- confirmar compra
- activar entrega automática del PDF
- disparar email de bienvenida
- registrar pedido o lead en otras herramientas

---

## Paso a paso para conectar Stripe después

### Opción A: conectar Payment Link en 2 minutos
1. Crear el producto de 29€ en Stripe
2. Crear Payment Link
3. Copiar la URL
4. Abrir `app/page.tsx`
5. Reemplazar el CTA provisional por la URL de Stripe
6. Deploy a Vercel

### Opción B: integrar Checkout Session
1. Crear producto y precio en Stripe
2. Guardar `price_id`
3. Añadir variables de entorno en Vercel
4. Crear endpoint backend para generar la session
5. Hacer que el botón de compra apunte a ese flujo
6. Crear webhook
7. Probar con tarjetas de test
8. Pasar a claves live cuando todo esté validado

---

## Qué falta si Alberto quiere integración Stripe completa en código

Ahora mismo la landing está preparada visualmente, pero **no incluye aún backend Stripe**.

Para dejar la integración completa habría que añadir:
- endpoint para crear `checkout session`
- redirección al checkout
- página de éxito/cancelación
- webhook handler
- posible entrega automática del PDF

---

## Assets pendientes de sustituir

Alberto puede cambiar después:
- logo
- mockup del PDF
- screenshots del producto
- testimonios reales
- dominio final
- copy fina de venta

---

## Archivos clave del proyecto
- `app/page.tsx` → landing principal
- `app/layout.tsx` → metadata SEO
- `app/globals.css` → estilos base
- `components/section-title.tsx` → títulos de sección reutilizables

---

## Recomendación técnica final

Si Alberto quiere **salir ya**, que use **Stripe Payment Link**.
Si quiere **escalar con automatizaciones**, que vaya a **Stripe Checkout + webhook**.

Para este proyecto, mi recomendación práctica sería:
1. **Primero Payment Link** para validar ventas rápido
2. **Después Checkout + webhook** cuando quiera automatizar entrega y seguimiento

# Plan Integral de Ventas - OpenClaw para Filmmakers

## 📋 Resumen Ejecutivo

Este plan describe el sistema completo para vender la guía "OpenClaw para Filmmakers" y el bundle "Guía + Sesión 1:1", incluyendo landing page, pasarela de pagos Stripe, captura de emails con ConvertKit y automatización post-compra.

---

## 1. Arquitectura Técnica

### Diagrama del Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE VENTAS                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Visitante  │────▶│ Landing Page │────▶│   Descarga   │
│   (Tráfico)  │     │  (Vercel)    │     │   Gratuita   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CAPTURA DE EMAILS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Modal de descarga ──▶ Formulario email ──▶ ConvertKit (tag: guia-filmmaker)│
│                                               ├─▶ Secuencia nurture         │
│                                               └─▶ Tag para ofertas futuras  │
└─────────────────────────────────────────────────────────────────────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PAGO - PRODUCTOS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────────────────────┐ │
│  │ PRODUCTO A          │    │ PRODUCTO B                                  │ │
│  │ Guía PDF - €29      │    │ Guía + Sesión 1:1 - €97-€147               │ │
│  │                     │    │                                             │ │
│  │ Stripe Checkout     │    │ Stripe Checkout                             │ │
│  │ ► Pago único        │    │ ► Pago único                                │ │
│  │ ► Entrega digital   │    │ ► Entrega PDF + booking Calendly           │ │
│  └─────────────────────┘    └─────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POST-COMPRA (Webhook)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Stripe Webhook ──▶ API Route /api/stripe/webhook ──▶ Acciones:            │
│                                                      ├─▶ Email con PDF      │
│                                                      ├─▶ Tag en ConvertKit  │
│                                                      ├─▶ Notificación admin │
│                                                      └─▶ Calendly (si bundle)│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Componente | Tecnología | Coste |
|------------|------------|-------|
| **Hosting** | Vercel (Pro plan recomendado) | €0-20/mes |
| **Framework** | Next.js 14+ (App Router) | Gratis |
| **Estilos** | Tailwind CSS | Gratis |
| **Pagos** | Stripe | 1.5% + €0.25 por transacción (EU) |
| **Email Marketing** | ConvertKit (Creator plan) | $25-50/mes |
| **Booking sesiones** | Calendly (Professional) | $12/mes |
| **PDF Hosting** | Vercel / Cloudinary | €0-10/mes |
| **Dominio** | Namecheap / Vercel | €10-15/año |

---

## 2. Especificaciones Técnicas Detalladas

### 2.1 Stripe - Configuración de Productos

#### Producto 1: Guía PDF (€29)
```json
{
  "name": "OpenClaw para Filmmakers - Guía Premium",
  "description": "Guía práctica completa para automatizar tu workflow creativo con OpenClaw",
  "price": 2900,
  "currency": "eur",
  "type": "one_time",
  "metadata": {
    "product_type": "digital_guide",
    "delivery_method": "email_pdf",
    "access_duration": "lifetime"
  }
}
```

#### Producto 2: Guía + Sesión 1:1 (€127)
```json
{
  "name": "OpenClaw para Filmmakers - Guía + Sesión 1:1",
  "description": "Guía premium + sesión personalizada 40 min para implementar OpenClaw en tu flujo",
  "price": 12700,
  "currency": "eur",
  "type": "one_time",
  "metadata": {
    "product_type": "bundle",
    "delivery_method": "email_pdf_plus_session",
    "session_duration": "40_min",
    "calendly_event_type": "sesion-openclaw-filmmakers"
  }
}
```

### 2.2 Variables de Entorno Requeridas

```bash
# Stripe (Test)
STRIPE_SECRET_KEY_TEST=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxxxx

# Stripe (Live)
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Stripe - IDs de Productos
STRIPE_PRICE_ID_GUIDE=price_xxxxx
STRIPE_PRICE_ID_BUNDLE=price_xxxxx

# Stripe Webhook
STRIPE_WEBHOOK_SECRET_TEST=whsec_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ConvertKit
CONVERTKIT_API_KEY=xxxxxx
CONVERTKIT_FORM_ID=xxxxxx
CONVERTKIT_TAG_GUIDE=xxxxxx
CONVERTKIT_TAG_CUSTOMER=xxxxxx
CONVERTKIT_TAG_BUNDLE=xxxxxx

# Calendly
CALENDLY_EVENT_TYPE_GUIDE=sesion-openclaw-filmmakers
CALENDLY_USER_URI=https://api.calendly.com/users/xxxxx

# Configuración General
NEXT_PUBLIC_SITE_URL=https://openclaw-filmmakers.com
ADMIN_EMAIL=alberto@tuvideopromocional.es
PDF_GUIDE_URL=/guia-openclaw-filmmakers.pdf
```

### 2.3 API Routes Necesarios

```
app/
├── api/
│   ├── stripe/
│   │   ├── checkout/
│   │   │   └── route.ts          # POST - Crear sesión de checkout
│   │   └── webhook/
│   │       └── route.ts          # POST - Recibir webhooks de Stripe
│   ├── convertkit/
│   │   └── subscribe/
│   │       └── route.ts          # POST - Añadir suscriptor + tag
│   └── download/
│       └── route.ts              # GET - Entregar PDF (con email capturado)
```

### 2.4 Eventos de Stripe Webhook

| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | Confirmar compra, enviar email, tag en ConvertKit |
| `payment_intent.succeeded` | Confirmación adicional de pago |
| `payment_intent.payment_failed` | Notificar fallo, ofrecer retry |
| `checkout.session.expired` | Log para análisis de abandono |
| `charge.refunded` | Revocar acceso si aplica |

---

## 3. Plan de Implementación por Fases

### FASE 1: Captura de Emails + MVP (Semana 1)
**Objetivo:** Tener landing funcional recolectando leads

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Integrar ConvertKit en modal de descarga | 2h | Alta |
| Crear API route `/api/convertkit/subscribe` | 1.5h | Alta |
| Formulario de email en modal (validación) | 1h | Alta |
| Secuencia de 3 emails en ConvertKit | 3h | Media |
| Testear flujo completo | 1h | Alta |

**Entregable:** Landing capturando emails, enviando secuencia automática

### FASE 2: Stripe Checkout Test (Semana 2)
**Objetivo:** Procesar pagos en modo test

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Crear productos en Stripe Dashboard (test) | 1h | Alta |
| Instalar dependencia `stripe` | 0.5h | Alta |
| API route `/api/stripe/checkout` | 2h | Alta |
| Actualizar botones de "Comprar" en landing | 1h | Alta |
| Crear página `/gracias` post-compra | 1h | Media |
| Crear página `/cancelado` | 0.5h | Baja |
| Testear checkout completo con tarjetas test | 1h | Alta |

**Entregable:** Flujo de pago funcional en modo test

### FASE 3: Webhooks + Entrega Automática (Semana 2-3)
**Objetivo:** Automatizar post-compra

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| API route `/api/stripe/webhook` | 2h | Alta |
| Configurar webhook endpoint en Stripe | 0.5h | Alta |
| Función de envío de email con PDF | 2h | Alta |
| Integración ConvertKit (tags post-compra) | 1.5h | Media |
| Logging y manejo de errores | 1h | Media |
| Testear webhook local con Stripe CLI | 1h | Alta |

**Entregable:** Compra automática entrega PDF por email

### FASE 4: Sesiones 1:1 + Calendly (Semana 3)
**Objetivo:** Producto bundle funcional

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Crear evento en Calendly (40 min) | 0.5h | Alta |
| Configurar Calendly para aceptar pagos vía Stripe | 0.5h | Media |
| Actualizar página `/gracias` con info de sesión | 1h | Media |
| Email específico para compradores de bundle | 1h | Media |
| Testear flujo completo de bundle | 1h | Alta |

**Entregable:** Bundle con booking automático

### FASE 5: Producción (Semana 4)
**Objetivo:** Go-live

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Cambiar a claves live de Stripe | 0.5h | Alta |
| Configurar webhook de producción | 0.5h | Alta |
| Variables de entorno en Vercel (producción) | 0.5h | Alta |
| Configurar impuestos en Stripe (IVA EU) | 1h | Alta |
| Compra de prueba real (€1) | 0.5h | Alta |
| Deploy a dominio final | 0.5h | Alta |

---

## 4. Presupuesto de Costes

### Costes Fijos Mensuales

| Servicio | Plan | Coste/mes |
|----------|------|-----------|
| Vercel Pro | Hosting + Analytics | €20 |
| ConvertKit | Creator (1k-3k subs) | ~$29 (~€27) |
| Calendly | Professional | $12 (~€11) |
| **TOTAL FIJO** | | **~€58/mes** |

### Costes por Transacción (Stripe)

| Escenario | Comisión | Ingreso Neto |
|-----------|----------|--------------|
| Guía €29 | €0.69 (1.5% + €0.25) + IVA automático | ~€26.31 |
| Bundle €127 | €2.16 (1.5% + €0.25) + IVA automático | ~€119.84 |

### Proyección de Ingresos

| Ventas/mes | Guías (€29) | Bundles (€127) | Bruto | Comisiones | Neto |
|------------|-------------|----------------|-------|------------|------|
| 10 guías, 2 bundles | €290 | €254 | €544 | ~€11 | ~€495 |
| 25 guías, 5 bundles | €725 | €635 | €1,360 | ~€26 | ~€1,225 |
| 50 guías, 10 bundles | €1,450 | €1,270 | €2,720 | ~€50 | ~€2,450 |

### ROI del Sistema

- **Inversión inicial:** ~20-25 horas de desarrollo
- **Coste mensual:** ~€58
- **Punto de equilibrio:** 2-3 ventas/mes cubren costes fijos

---

## 5. Timeline del Proyecto

```
SEMANA 1          SEMANA 2          SEMANA 3          SEMANA 4
   │                 │                 │                 │
   ▼                 ▼                 ▼                 ▼
┌──────┐         ┌──────┐         ┌──────┐         ┌──────┐
│FASE 1│────────▶│FASE 2│────────▶│FASE 3│────────▶│FASE 4│
│Email │         │Stripe│         │Web-  │         │Pro-  │
│Capture│        │Test  │         │hooks │         │duction│
└──────┘         └──────┘         └──────┘         └──────┘
   │                 │                 │                 │
   ▼                 ▼                 ▼                 ▼
Landing          Checkout          Auto-             LIVE
funcional        funcional         mático            🚀
```

**Total estimado:** 3-4 semanas para sistema completo

---

## 6. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Webhook falla** | Media | Alto | Logging + alertas email; sistema de retry manual |
| **Email llega a spam** | Media | Alto | SPF/DKIM configurados; usar ConvertKit (buena reputación) |
| **Stripe bloquea cuenta** | Baja | Alto | Verificar negocio antes; no palabras prohibidas; términos claros |
| **Abandono de checkout** | Alta | Medio | Email de recuperación automático; remarketing |
| **Confusión con el bundle** | Media | Medio | Página de gracias clara; email con instrucciones específicas |
| **IVA incorrecto** | Media | Alto | Activar Stripe Tax; configurar correctamente país fiscal |
| **PDF filtrado** | Baja | Medio | URL no guessable; entrega por email vinculado a compra |

---

## 7. Flujo de Emails Automatizados

### Secuencia Post-Descarga Gratuita (ConvertKit)

| Email | Día | Asunto | Contenido |
|-------|-----|--------|-----------|
| 1 | 0 | "Tu guía OpenClaw está aquí" | Link de descarga + presentación |
| 2 | 3 | "¿Ya probaste esto en tu workflow?" | Quick win fácil de implementar |
| 3 | 7 | "La diferencia entre improvisar y escalar" | Caso de estudio + CTA bundle |
| 4 | 14 | "Última oportunidad: sesión 1:1" | Urgencia suave + descuento opcional |

### Email Post-Compra (Guía €29)

| Email | Timing | Asunto | Contenido |
|-------|--------|--------|-----------|
| 1 | Inmediato | "Acceso confirmado - OpenClaw para Filmmakers" | Link PDF + primeros pasos |
| 2 | 24h | "¿Necesitas ayuda para empezar?" | Oferta sesión 1:1 (upgrade) |
| 3 | 7 días | "¿Qué has implementado?" | Feedback + testimonio request |

### Email Post-Compra (Bundle €127)

| Email | Timing | Asunto | Contenido |
|-------|--------|--------|-----------|
| 1 | Inmediato | "Tu sesión 1:1 + Guía - próximos pasos" | PDF + link Calendly |
| 2 | Post-sesión | "Resumen de tu sesión" | Notas + recursos adicionales |
| 3 | 14 días | "¿Cómo va tu implementación?" | Follow-up + caso de estudio |

---

## 8. Checklist de Lanzamiento

### Pre-launch (Mínimo Viable)
- [ ] Landing page funcional
- [ ] Modal de descarga con captura de email
- [ ] ConvertKit integrado
- [ ] Secuencia de nurture activa
- [ ] Stripe Checkout en test funcional
- [ ] Webhook de test funcionando
- [ ] Email post-compra envía PDF

### Go-live Checklist
- [ ] Cuenta Stripe verificada y en modo live
- [ ] Claves live en Vercel
- [ ] Webhook de producción configurado
- [ ] Impuestos (IVA) configurados en Stripe
- [ ] Dominio personalizado apuntando a Vercel
- [ ] SSL activo (https)
- [ ] Política de privacidad actualizada
- [ ] Condiciones de venta publicadas
- [ ] Cookie banner funcional
- [ ] Compra de prueba real completada
- [ ] Email de bienvenida revisado
- [ ] Backup del PDF en múltiples ubicaciones

---

## 9. Métricas Clave (KPIs)

| Métrica | Objetivo | Cómo medir |
|---------|----------|------------|
| Tasa de conversión visita → email | >15% | ConvertKit analytics |
| Tasa de conversión email → compra | >3% | Stripe + ConvertKit |
| Tasa de abandono de checkout | <60% | Stripe dashboard |
| Ingreso por visitante | >€1 | Stripe / Analytics |
| Valor lifetime del cliente | >€40 | Stripe data |
| NPS / Satisfacción | >7 | Email post-compra |

---

## 10. Próximos Pasos Inmediatos

### Para Alberto (Configuración):
1. Verificar cuenta Stripe está completa y verificada
2. Crear cuenta ConvertKit (si no tiene)
3. Crear cuenta Calendly Professional
4. Preparar versión final del PDF de la guía
5. Escribir secuencia de 3-4 emails de nurture

### Para Desarrollo (Dani):
1. Implementar API route de ConvertKit
2. Modificar modal de descarga para pedir email
3. Crear productos en Stripe (test)
4. Implementar checkout básico
5. Configurar webhook y entrega de PDF

---

*Documento creado: Marzo 2025*
*Última actualización: Fase 1 lista para implementación*

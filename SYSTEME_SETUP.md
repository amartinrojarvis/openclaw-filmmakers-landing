# Integración Systeme.io - OpenClaw Filmmakers

## 📋 Resumen de Configuración

### Estado Actual
- ✅ Helper creado: `lib/systeme.ts`
- ✅ Webhook actualizado: `app/api/stripe/webhook/route.ts`
- ✅ Tag creado vía API: `compro-guia` (ID: 1931231)
- ⚠️ Limitación: Plan gratuito permite solo 1 tag
- ❌ Automatizaciones: Requieren configuración manual en UI

---

## 🔧 Configuración Manual Requerida en Systeme.io

### Paso 1: Crear Tag Adicional (si es necesario)
Dado que el plan gratuito solo permite 1 tag, tenemos dos opciones:

**Opción A (Recomendada):** Usar el mismo tag `compro-guia` para ambos productos y enviar el mismo email (la guía) a todos los compradores. El bundle incluye la sesión 1:1 que se gestiona aparte.

**Opción B:** Actualizar a plan de pago para tener múltiples tags.

### Paso 2: Crear Automatización de Email

1. **Accede a Systeme.io:** https://systeme.io/dashboard
2. **Ve a:** Contacts → Automations → Create Automation
3. **Configura el trigger:**
   - Trigger: "Tag is added"
   - Tag: `compro-guia`

4. **Añade acción de Email:**
   - Action: "Send email"
   - Delay: Immediately

5. **Contenido del Email:**

**Asunto:** Tu Guía OpenClaw para Filmmakers está aquí 🎬

**Contenido HTML:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">¡Hola!</h2>
  
  <p>Gracias por tu compra. Aquí tienes acceso inmediato a tu guía:</p>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
    <p style="margin: 0 0 10px 0; font-weight: bold;">🔗 ACCEDER A LA GUÍA:</p>
    <a href="https://notion.so/32caed8e7d07814d96f2c481afd82ee4" 
       style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
       Abrir Guía en Notion
    </a>
  </div>
  
  <h3>La guía incluye:</h3>
  <ul>
    <li>✅ Instalación paso a paso de OpenClaw</li>
    <li>✅ Configuración para filmmakers</li>
    <li>✅ Workflows profesionales</li>
    <li>✅ Recursos y plantillas</li>
  </ul>
  
  <p><strong>Guárdala en tus favoritos</strong> - siempre tendrás acceso.</p>
  
  <p style="margin-top: 30px;">
    ¡A automatizar! 🚀<br>
    Alberto (y Jarvis)
  </p>
</div>
```

6. **Activa la automatización:**
   - Toggle: Active

---

## 🚀 Deploy a Vercel

### Variables de Entorno Requeridas

Añade esta variable en Vercel:

```
SYSTEME_API_KEY=ely4bdycnk9hsy2latoehl5ggfnwu3ywjf8gsn74xqvpbmh8venqlybvw6bndqjc
```

**Nota:** También puedes eliminar `KIT_API_KEY` si ya no se usa.

### Comandos para Deploy

```bash
# Hacer commit de los cambios
git add lib/systeme.ts app/api/stripe/webhook/route.ts
git commit -m "Feat: integra Systeme.io para emails post-compra

- Crea helper lib/systeme.ts para API de Systeme.io
- Actualiza webhook de Stripe para usar Systeme.io
- Elimina dependencia de Kit.com"

# Deploy a Vercel
vercel --prod
```

---

## 🧪 Testing

### Test del Flujo Completo

1. **Compra de prueba:**
   - Ve a la landing: https://openclaw-filmmakers-landing.vercel.app
   - Realiza una compra de prueba con Stripe
   - Usa email: test+guia@example.com

2. **Verificación en Systeme.io:**
   - Ve a Contacts en Systeme.io
   - Busca el email de prueba
   - Verifica que tiene el tag `compro-guia`

3. **Verificación del Email:**
   - Revisa la bandeja de entrada del email de prueba
   - Confirma que llegó el email con el link a Notion

### Test de la API

```bash
# Listar tags
curl -X GET "https://api.systeme.io/api/tags" \
  -H "X-API-Key: $SYSTEME_API_KEY"

# Crear contacto de prueba
curl -X POST "https://api.systeme.io/api/contacts" \
  -H "X-API-Key: $SYSTEME_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "tags": ["compro-guia"]
  }'
```

---

## 📊 Comparativa: Kit.com vs Systeme.io

| Característica | Kit.com | Systeme.io |
|----------------|---------|------------|
| Plan gratuito | Sí (hasta 250 suscriptores) | Sí (hasta 2,000 contactos) |
| Emails automáticos | ❌ Requiere plan de pago | ✅ Gratis en plan gratuito |
| Tags | Ilimitados | 1 en plan gratuito |
| Sequences | Pago | Gratis |
| Embudos/Ventas | Básico | Completo |

**Conclusión:** Systeme.io es mejor opción para el flujo post-compra porque permite automatizaciones de email en el plan gratuito.

---

## 📝 Notas de Implementación

### Código Modificado

1. **lib/systeme.ts** (nuevo)
   - Helper completo para API de Systeme.io
   - Métodos: addContact, addTag, listTags
   - Compatible con el flujo existente

2. **app/api/stripe/webhook/route.ts** (modificado)
   - Reemplaza `addSubscriber` de Kit por `addContact` de Systeme
   - Usa `SYSTEME_TAGS` en lugar de `KIT_TAGS`
   - Elimina función `sendProductEmail` (ahora manejado por Systeme)

### Limitaciones Conocidas

1. **Plan gratuito Systeme.io:**
   - Solo 1 tag permitido
   - Solución: Usar mismo tag para guía y bundle

2. **Automatizaciones:**
   - No disponibles vía API
   - Requieren configuración manual en dashboard

3. **Emails:**
   - El email es el mismo para guía y bundle
   - El bundle incluye sesión 1:1 que se gestiona aparte

---

## 🔗 Recursos

- **Landing:** https://openclaw-filmmakers-landing.vercel.app
- **Systeme.io Dashboard:** https://systeme.io/dashboard
- **API Docs:** https://docs.systeme.io/api
- **Notion Guía:** https://notion.so/32caed8e7d07814d96f2c481afd82ee4

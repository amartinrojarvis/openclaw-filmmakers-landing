# Configuración Manual de Automatización Email en Kit

## ⚠️ Estado de la API

El API key proporcionado no es válido para la API de Kit. Esto puede deberse a:
- La clave fue revocada
- Es una "API Secret" en lugar de "API Key"
- La cuenta necesita verificación adicional

**Solución:** Configuración manual en el dashboard de Kit (igual de efectiva).

---

## 📋 Resumen de lo que necesitamos

| Elemento | Valor |
|----------|-------|
| **Tags de activación** | `compro-guia`, `compro-bundle` |
| **Asunto del email** | Tu Guía OpenClaw para Filmmakers está aquí 🎬 |
| **Link a Notion** | https://notion.so/32caed8e7d07814d96f2c481afd82ee4 |
| **Momento de envío** | Inmediato al recibir el tag |

---

## 🚀 Guía de Configuración Paso a Paso

### PASO 1: Crear los Tags

1. Ve a https://app.kit.com/subscribers
2. Haz clic en **"Tags"** en el menú lateral
3. Haz clic en **"+ Create a tag"**
4. Crea estos dos tags:
   - `compro-guia`
   - `compro-bundle`
5. Anota los IDs de los tags (aparecen en la URL al hacer clic en cada tag)

### PASO 2: Crear el Email (Sequence o Broadcast)

**Opción A: Sequence (Recomendado para automatización)**

1. Ve a https://app.kit.com/sequences
2. Haz clic en **"+ Create sequence"**
3. Nombre: `Entrega Guía OpenClaw para Filmmakers`
4. Haz clic en **"Add email"**
5. Configura:
   - **Subject:** `Tu Guía OpenClaw para Filmmakers está aquí 🎬`
   - **Send:** `0 days after subscribe` (inmediato)
   - **Content:** Copia el HTML de abajo

**Opción B: Plantilla de Email (para uso manual)**

1. Ve a https://app.kit.com/email_templates
2. Haz clic en **"Create template"**
3. Nombre: `Entrega Guía OpenClaw`
4. Copia el HTML del archivo `kit-email-template.html`

### PASO 3: Crear la Automatización

1. Ve a https://app.kit.com/automations
2. Haz clic en **"Create automation"**
3. Elige **"Start from scratch"**
4. Configura el trigger:
   - **Event:** `Tag added`
   - **Tag:** Selecciona `compro-guia`
   - Haz clic en **"Add filter"** y añade `OR tag compro-bundle`
5. Añade la acción:
   - **Action:** `Send email` (o `Subscribe to sequence` si usaste la opción A)
   - Selecciona el email/sequence creado
6. Activa la automatización: Cambia el switch a **ON**

### PASO 4: Probar la Automatización

1. Ve a https://app.kit.com/subscribers
2. Haz clic en **"Add subscriber"**
3. Añade un email de prueba (puede ser uno tuyo)
4. Una vez creado, añade el tag `compro-guia`
5. Verifica que recibas el email con el link a Notion

---

## 📧 Template de Email (HTML)

Copia este código en el editor HTML de Kit:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Guía OpenClaw</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <h1 style="color: #2c3e50;">¡Gracias por tu compra! 🎬</h1>
  
  <p>Hola,</p>
  
  <p>Acabas de dar un paso importante para automatizar tu workflow creativo con OpenClaw. Como filmmaker, sé que tu tiempo es valioso y que cada minuto cuenta cuando estás en producción.</p>
  
  <p><strong>Tu Guía OpenClaw para Filmmakers está lista:</strong></p>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
    <a href="https://notion.so/32caed8e7d07814d96f2c481afd82ee4" style="display: inline-block; background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
      📖 Acceder a la Guía en Notion
    </a>
  </div>
  
  <p>La guía incluye:</p>
  <ul>
    <li>✅ Configuración paso a paso de OpenClaw</li>
    <li>✅ Scripts útiles para filmmakers</li>
    <li>✅ Workflows de automatización</li>
    <li>✅ Ejemplos prácticos de uso</li>
  </ul>
  
  <p>Si tienes alguna pregunta o necesitas ayuda para implementar algo específico, simplemente responde a este email.</p>
  
  <p>¡A crear!<br>
  <strong>Alberto Martín</strong><br>
  <em>OpenClaw para Filmmakers</em></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #666;">
    Este email fue enviado porque adquiriste la Guía OpenClaw para Filmmakers. 
    Si crees que es un error, por favor responde a este email.
  </p>
  
</body>
</html>
```

---

## 🔗 Integración con Stripe (Webhook)

Para que la automatización funcione automáticamente cuando alguien compra, necesitas configurar el webhook de Stripe para añadir el tag:

### En tu webhook de Stripe (`/api/stripe/webhook`):

```javascript
// Cuando se complete una compra
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const customerEmail = session.customer_email;
  
  // Determinar qué tag aplicar según el producto
  const tagName = session.metadata.product_type === 'bundle' 
    ? 'compro-bundle' 
    : 'compro-guia';
  
  // Añadir tag en Kit via API
  await fetch('https://api.convertkit.com/v3/tags/' + tagId + '/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.KIT_API_KEY,
      email: customerEmail,
    }),
  });
}
```

---

## ✅ Checklist de Verificación

- [ ] Tags `compro-guia` y `compro-bundle` creados en Kit
- [ ] Sequence/Email creado con el HTML correcto
- [ ] Automatización configurada (Tag → Email)
- [ ] Automatización activada (switch ON)
- [ ] Prueba realizada con email de prueba
- [ ] Webhook de Stripe configurado para añadir tags
- [ ] Email llega correctamente a inbox (no spam)
- [ ] Link a Notion funciona correctamente

---

## 📞 Soporte

Si tienes problemas:
- Documentación de Kit: https://developers.kit.com/
- Email de soporte Kit: help@kit.com
- Chat en vivo: https://app.kit.com (esquina inferior derecha)

---

*Documento creado: Marzo 2025*
*Para: OpenClaw para Filmmakers - Alberto Martín*

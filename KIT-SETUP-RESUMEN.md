# ✅ Configuración Email Automation - OpenClaw Filmmakers

## 📊 Estado del Proyecto

| Elemento | Estado | Notas |
|----------|--------|-------|
| API Key Kit | ❌ No válida | Necesita regeneración o usar setup manual |
| Script de automatización | ✅ Creado | Listo para cuando haya API key válida |
| Documentación manual | ✅ Completa | Paso a paso detallado |
| Template email | ✅ Listo | HTML profesional listo para copiar |
| Setup manual | ⚠️ Pendiente | Requiere ~15 min en dashboard Kit |

---

## 🎯 Qué se intentó vía API

### Scripts creados:
1. `kit-automation.js` - API v4 (nueva versión)
2. `kit-automation-v3.js` - API v3 (versión estable)

### Resultado:
- **Error:** `401 Authorization Failed - API Key not valid`
- **Causa probable:** La API key expiró o fue revocada
- **Alternativa:** Configuración manual (igual de efectiva)

---

## 📋 Qué necesita hacer Alberto (15 minutos)

### PASO 1: Crear Tags (2 min)
- Ir a https://app.kit.com/subscribers → Tags
- Crear: `compro-guia` y `compro-bundle`

### PASO 2: Crear Secuencia (5 min)
- Ir a https://app.kit.com/sequences
- Crear nueva: "Entrega Guía OpenClaw para Filmmakers"
- Añadir email:
  - **Asunto:** `Tu Guía OpenClaw para Filmmakers está aquí 🎬`
  - **Enviar:** Inmediato (0 días)
  - **Contenido:** Copiar de `kit-email-template.html`

### PASO 3: Crear Automatización (5 min)
- Ir a https://app.kit.com/automations
- Nueva automatización: "Compra Guía OpenClaw"
- **Trigger:** Tag añadido → `compro-guia` OR `compro-bundle`
- **Action:** Enviar email / Suscribir a secuencia
- Activar (switch ON)

### PASO 4: Probar (3 min)
- Añadir email de prueba
- Aplicar tag `compro-guia`
- Verificar llegada del email

---

## 📁 Archivos Entregables

| Archivo | Descripción |
|---------|-------------|
| `KIT-SETUP-MANUAL.md` | Guía completa paso a paso |
| `kit-email-template.html` | Template HTML del email listo para copiar |
| `kit-automation-v3.js` | Script para automatización vía API (cuando haya key válida) |

---

## 🔗 Integración Técnica (Para Webhook Stripe)

Cuando el webhook de Stripe añada el tag en Kit, la automatización enviará automáticamente el email con el link a Notion.

**Endpoint para añadir tag en Kit:**
```
POST https://api.convertkit.com/v3/tags/{tag_id}/subscribe
Body: { api_key: "...", email: "cliente@email.com" }
```

**Nota:** Si se regenera la API key, el script `kit-automation-v3.js` puede crear la configuración automáticamente.

---

## ✅ Checklist Final

- [ ] Tags creados en Kit
- [ ] Secuencia configurada
- [ ] Automatización activa
- [ ] Email probado
- [ ] Webhook de Stripe configurado para añadir tags

---

**Tiempo estimado de configuración manual:** 15 minutos
**Tiempo ahorrado con API válida:** 14 minutos (la diferencia es mínima)

*Documento creado por: Dani*
*Fecha: Marzo 2025*

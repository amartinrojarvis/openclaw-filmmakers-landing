#!/usr/bin/env node
/**
 * Kit (ConvertKit) API v3 - Automation Setup
 * API v3 es más estable y ampliamente documentada
 */

const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_API_URL = 'https://api.convertkit.com/v3';

// Configuración de la automatización
const CONFIG = {
  sequenceName: 'Entrega Guía OpenClaw para Filmmakers',
  sequenceSubject: 'Tu Guía OpenClaw para Filmmakers está aquí 🎬',
  notionLink: 'https://notion.so/32caed8e7d07814d96f2c481afd82ee4',
  triggerTags: ['compro-guia', 'compro-bundle'],
};

/**
 * Función auxiliar para hacer peticiones GET
 */
async function apiGet(endpoint, params = {}) {
  const queryParams = new URLSearchParams({ api_key: KIT_API_KEY, ...params });
  const url = `${KIT_API_URL}${endpoint}?${queryParams}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  return await response.json();
}

/**
 * Función auxiliar para hacer peticiones POST
 */
async function apiPost(endpoint, data = {}) {
  const url = `${KIT_API_URL}${endpoint}`;
  const body = JSON.stringify({
    api_key: KIT_API_KEY,
    ...data
  });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body,
  });
  
  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${responseText}`);
  }
  
  try {
    return JSON.parse(responseText);
  } catch {
    return { success: true, raw: responseText };
  }
}

/**
 * Obtener información de la cuenta
 */
async function getAccount() {
  console.log('   → Consultando /account...');
  return await apiGet('/account');
}

/**
 * Listar todos los tags
 */
async function listTags() {
  console.log('   → Consultando /tags...');
  const data = await apiGet('/tags');
  return data.tags || [];
}

/**
 * Crear un nuevo tag
 */
async function createTag(name) {
  console.log(`   → Creando tag "${name}"...`);
  const data = await apiPost('/tags', { tag: { name } });
  console.log(`   ✅ Tag "${name}" creado (ID: ${data.id || data.tag?.id})`);
  return data;
}

/**
 * Listar todas las secuencias (courses en v3)
 */
async function listSequences() {
  console.log('   → Consultando /courses...');
  const data = await apiGet('/courses');
  return data.courses || [];
}

/**
 * Crear una secuencia (course en v3)
 */
async function createSequence(name) {
  console.log(`   → Creando secuencia "${name}"...`);
  const data = await apiPost('/courses', { course: { name } });
  console.log(`   ✅ Secuencia creada (ID: ${data.id || data.course?.id})`);
  return data;
}

/**
 * Crear un broadcast (email único)
 */
async function createBroadcast(subject, content, tagIds = []) {
  console.log(`   → Creando broadcast "${subject}"...`);
  const data = await apiPost('/broadcasts', {
    broadcast: {
      subject,
      content,
      email_layout_template_id: null,
    },
    // Añadir tags como audiencia
    ...(tagIds.length > 0 && { tag_ids: tagIds })
  });
  console.log(`   ✅ Broadcast creado (ID: ${data.id || data.broadcast?.id})`);
  return data;
}

/**
 * Añadir suscriptor a una secuencia
 */
async function addSubscriberToSequence(sequenceId, email) {
  console.log(`   → Añadiendo suscriptor a secuencia ${sequenceId}...`);
  const data = await apiPost(`/courses/${sequenceId}/subscribe`, {
    email,
  });
  console.log(`   ✅ Suscriptor añadido`);
  return data;
}

/**
 * Añadir tag a suscriptor
 */
async function tagSubscriber(tagId, email) {
  console.log(`   → Añadiendo tag ${tagId} a ${email}...`);
  const data = await apiPost(`/tags/${tagId}/subscribe`, { email });
  console.log(`   ✅ Tag añadido`);
  return data;
}

/**
 * Contenido del email de entrega
 */
function getEmailContent() {
  return `<!DOCTYPE html>
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
    <a href="${CONFIG.notionLink}" style="display: inline-block; background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
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
</html>`;
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Kit (ConvertKit) API v3 - Automation Setup\n');
  console.log('=' .repeat(60));
  
  try {
    // 1. Verificar cuenta
    console.log('\n📋 PASO 1: Verificando cuenta...');
    const account = await getAccount();
    console.log(`✅ Cuenta conectada:`);
    console.log(`   - Nombre: ${account.name || 'N/A'}`);
    console.log(`   - Email: ${account.primary_email_address || 'N/A'}`);
    
    // 2. Tags
    console.log('\n📋 PASO 2: Configurando tags...');
    const existingTags = await listTags();
    console.log(`   Total de tags existentes: ${existingTags.length}`);
    
    const tags = [];
    for (const tagName of CONFIG.triggerTags) {
      const existingTag = existingTags.find(t => t.name === tagName);
      if (existingTag) {
        console.log(`   ℹ️ Tag "${tagName}" ya existe (ID: ${existingTag.id})`);
        tags.push(existingTag);
      } else {
        const newTag = await createTag(tagName);
        tags.push(newTag);
      }
    }
    
    // 3. Secuencias
    console.log('\n📋 PASO 3: Revisando secuencias...');
    const sequences = await listSequences();
    console.log(`   Total de secuencias existentes: ${sequences.length}`);
    
    let sequence = sequences.find(s => s.name === CONFIG.sequenceName);
    if (sequence) {
      console.log(`   ℹ️ Secuencia "${CONFIG.sequenceName}" ya existe (ID: ${sequence.id})`);
    } else {
      console.log('   ⚠️ No se encontró la secuencia, necesitarás crearla manualmente');
    }
    
    // 4. Crear un broadcast de prueba (opcional)
    console.log('\n📋 PASO 4: Configurando email de entrega...');
    const emailContent = getEmailContent();
    
    // Intentar crear un broadcast (para uso manual)
    try {
      const broadcast = await createBroadcast(
        CONFIG.sequenceSubject,
        emailContent,
        tags.map(t => t.id)
      );
      console.log(`   ✅ Broadcast listo para envío manual`);
    } catch (e) {
      console.log(`   ⚠️ No se pudo crear broadcast: ${e.message}`);
    }
    
    // 5. Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE CONFIGURACIÓN');
    console.log('='.repeat(60));
    console.log(`\n✅ Tags configurados:`);
    tags.forEach(tag => {
      console.log(`   - ID: ${tag.id} | Nombre: "${tag.name}"`);
    });
    
    if (sequence) {
      console.log(`\n✅ Secuencia existente: "${sequence.name}" (ID: ${sequence.id})`);
    }
    
    console.log(`\n📧 Email configurado:`);
    console.log(`   Asunto: "${CONFIG.sequenceSubject}"`);
    console.log(`   Link Notion: ${CONFIG.notionLink}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  IMPORTANTE - ACCIONES MANUALES REQUERIDAS');
    console.log('='.repeat(60));
    console.log(`
Para completar la automatización, debes hacerlo manualmente en Kit:

1. Ir a https://app.kit.com/automations
2. Crear nueva automatización: "Compra Guía OpenClaw"
3. Trigger: "Tag is added" → "compro-guia" O "compro-bundle"
4. Action: "Send email"
5. Configurar el email:
   - Asunto: "${CONFIG.sequenceSubject}"
   - Contenido: (copiar del archivo HTML generado)
   
O si prefieres usar secuencia:
1. Ir a https://app.kit.com/sequences
2. Crear nueva secuencia: "${CONFIG.sequenceName}"
3. Añadir email con:
   - Asunto: "${CONFIG.sequenceSubject}"
   - Enviar inmediatamente (0 días después de suscribir)
4. Ir a Automations y crear:
   - Trigger: Tag "compro-guia" o "compro-bundle"
   - Action: Subscribe to sequence "${CONFIG.sequenceName}"
`);
    
    return {
      success: true,
      tags,
      sequence,
      emailSubject: CONFIG.sequenceSubject,
      emailContent: emailContent,
    };
    
  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('401')) {
      console.error('\n⚠️  El API key no es válido o ha expirado.');
      console.error('   Verifica el API key en: https://app.kit.com/account_settings/account_info');
    }
    
    return {
      success: false,
      error: error.message,
    };
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().then(result => {
    if (result.success) {
      // Guardar el contenido del email en un archivo para copiar fácilmente
      const fs = require('fs');
      const path = require('path');
      
      const emailHtmlPath = path.join(__dirname, 'kit-email-template.html');
      fs.writeFileSync(emailHtmlPath, result.emailContent);
      console.log(`\n💾 Template HTML guardado en: ${emailHtmlPath}`);
    }
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { main, getEmailContent, CONFIG };

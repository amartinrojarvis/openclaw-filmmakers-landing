#!/usr/bin/env node
/**
 * Kit (ConvertKit) API Automation Setup
 * Configura secuencias y automatizaciones para OpenClaw Filmmakers
 */

const KIT_API_KEY = process.env.KIT_API_KEY || 'REDACTED_KIT_API_KEY';
const KIT_API_URL = 'https://api.kit.com/v4';

// Configuración de la automatización
const CONFIG = {
  sequenceName: 'Entrega Guía OpenClaw para Filmmakers',
  sequenceSubject: 'Tu Guía OpenClaw para Filmmakers está aquí 🎬',
  notionLink: 'https://notion.so/32caed8e7d07814d96f2c481afd82ee4',
  triggerTags: ['compro-guia', 'compro-bundle'],
};

// Headers para las peticiones API
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${KIT_API_KEY}`,
    'Accept': 'application/json',
  };
}

/**
 * Obtener información de la cuenta
 */
async function getAccount() {
  try {
    const response = await fetch(`${KIT_API_URL}/account`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error obteniendo cuenta:', error.message);
    throw error;
  }
}

/**
 * Listar tags existentes
 */
async function listTags() {
  try {
    const response = await fetch(`${KIT_API_URL}/tags`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('❌ Error listando tags:', error.message);
    throw error;
  }
}

/**
 * Crear un tag si no existe
 */
async function createTag(name) {
  try {
    const response = await fetch(`${KIT_API_URL}/tags`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ tag: { name } }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    console.log(`✅ Tag creado: "${name}" (ID: ${data.tag?.id || data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ Error creando tag "${name}":`, error.message);
    throw error;
  }
}

/**
 * Listar secuencias existentes
 */
async function listSequences() {
  try {
    const response = await fetch(`${KIT_API_URL}/sequences`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    return data.sequences || [];
  } catch (error) {
    console.error('❌ Error listando secuencias:', error.message);
    throw error;
  }
}

/**
 * Crear una secuencia (automation sequence)
 */
async function createSequence(name) {
  try {
    const response = await fetch(`${KIT_API_URL}/sequences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        sequence: {
          name,
        }
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    console.log(`✅ Secuencia creada: "${name}" (ID: ${data.sequence?.id || data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ Error creando secuencia "${name}":`, error.message);
    throw error;
  }
}

/**
 * Crear un email broadcast (para envío inmediato)
 */
async function createBroadcast(subject, content, tagIds = []) {
  try {
    const broadcastData = {
      broadcast: {
        subject,
        content,
        email_layout_template_id: null,
      }
    };
    
    // Si tenemos tags, los añadimos como filtros
    if (tagIds.length > 0) {
      broadcastData.broadcast.filter = {
        tag_ids: tagIds,
      };
    }
    
    const response = await fetch(`${KIT_API_URL}/broadcasts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(broadcastData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    console.log(`✅ Broadcast creado: "${subject}" (ID: ${data.broadcast?.id || data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ Error creando broadcast:`, error.message);
    throw error;
  }
}

/**
 * Crear un email dentro de una secuencia
 */
async function createSequenceEmail(sequenceId, subject, content) {
  try {
    const response = await fetch(`${KIT_API_URL}/sequences/${sequenceId}/sequence_emails`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        sequence_email: {
          subject,
          content,
          days_from_start: 0, // Enviar inmediatamente
        }
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    console.log(`✅ Email añadido a secuencia (ID: ${data.sequence_email?.id || data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ Error creando email en secuencia:`, error.message);
    throw error;
  }
}

/**
 * Crear automatización: Tag → Enviar Secuencia
 */
async function createAutomation(tagId, sequenceId) {
  try {
    // Intentar crear una regla de automatización
    const response = await fetch(`${KIT_API_URL}/automations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        automation: {
          name: `Auto: Tag compro-guia → Email Guía`,
          trigger: {
            type: 'tag_added',
            tag_id: tagId,
          },
          actions: [
            {
              type: 'add_to_sequence',
              sequence_id: sequenceId,
            }
          ]
        }
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    console.log(`✅ Automatización creada (ID: ${data.automation?.id || data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ Error creando automatización:`, error.message);
    throw error;
  }
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
  console.log('🚀 Kit (ConvertKit) Automation Setup\n');
  console.log('=' .repeat(50));
  
  try {
    // 1. Verificar conexión con la cuenta
    console.log('\n📋 PASO 1: Verificando cuenta...');
    const account = await getAccount();
    console.log(`✅ Cuenta conectada: ${account.account?.name || account.name || 'Cuenta activa'}`);
    
    // 2. Crear/verificar tags
    console.log('\n📋 PASO 2: Configurando tags...');
    const existingTags = await listTags();
    console.log(`   Tags existentes: ${existingTags.length}`);
    
    const createdTags = [];
    for (const tagName of CONFIG.triggerTags) {
      const existingTag = existingTags.find(t => t.name === tagName);
      if (existingTag) {
        console.log(`   ℹ️ Tag "${tagName}" ya existe (ID: ${existingTag.id})`);
        createdTags.push(existingTag);
      } else {
        const newTag = await createTag(tagName);
        createdTags.push(newTag.tag || newTag);
      }
    }
    
    // 3. Crear secuencia
    console.log('\n📋 PASO 3: Creando secuencia...');
    const sequences = await listSequences();
    let sequence = sequences.find(s => s.name === CONFIG.sequenceName);
    
    if (sequence) {
      console.log(`   ℹ️ Secuencia "${CONFIG.sequenceName}" ya existe (ID: ${sequence.id})`);
    } else {
      const newSequence = await createSequence(CONFIG.sequenceName);
      sequence = newSequence.sequence || newSequence;
    }
    
    // 4. Crear email en la secuencia
    console.log('\n📋 PASO 4: Creando email en secuencia...');
    const emailContent = getEmailContent();
    const email = await createSequenceEmail(sequence.id, CONFIG.sequenceSubject, emailContent);
    
    // 5. Intentar crear automatización
    console.log('\n📋 PASO 5: Intentando crear automatización...');
    try {
      for (const tag of createdTags) {
        await createAutomation(tag.id, sequence.id);
      }
    } catch (autoError) {
      console.log(`   ⚠️ No se pudo crear automatización vía API: ${autoError.message}`);
      console.log('   ℹ️ Deberás configurarla manualmente en el dashboard de Kit');
    }
    
    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('✅ CONFIGURACIÓN COMPLETADA');
    console.log('='.repeat(50));
    console.log(`\n📧 Secuencia: "${CONFIG.sequenceName}"`);
    console.log(`   ID: ${sequence.id}`);
    console.log(`\n🏷️ Tags configurados:`);
    createdTags.forEach(tag => {
      console.log(`   - "${tag.name}" (ID: ${tag.id})`);
    });
    console.log(`\n📬 Email:`);
    console.log(`   Asunto: "${CONFIG.sequenceSubject}"`);
    console.log(`   Link Notion: ${CONFIG.notionLink}`);
    
    return {
      success: true,
      sequenceId: sequence.id,
      tags: createdTags,
    };
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA CONFIGURACIÓN:');
    console.error(error.message);
    
    return {
      success: false,
      error: error.message,
    };
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = {
  getAccount,
  listTags,
  createTag,
  listSequences,
  createSequence,
  createSequenceEmail,
  createAutomation,
  CONFIG,
};

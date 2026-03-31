// Helper para interactuar con Systeme.io API
// Documentación: https://docs.systeme.io/api

const SYSTEME_API_BASE = 'https://api.systeme.io/api';

interface SystemeContact {
  id: string;
  email: string;
  tags?: string[];
}

interface SystemeTag {
  id: string;
  name: string;
}

interface SystemeApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Añade un contacto a Systeme.io y le aplica tags específicos
 * @param email - Email del contacto
 * @param tags - Array de nombres de tags a aplicar
 * @returns El contacto creado o actualizado
 */
export async function addContact(
  email: string,
  tags: string[] = []
): Promise<{ success: boolean; contact?: SystemeContact; error?: string }> {
  const apiKey = process.env.SYSTEME_API_KEY;
  
  if (!apiKey) {
    console.error('SYSTEME_API_KEY no está configurada');
    return { success: false, error: 'SYSTEME_API_KEY no configurada' };
  }

  try {
    // Crear/actualizar contacto usando el endpoint de contacts
    const contactResponse = await fetch(`${SYSTEME_API_BASE}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        email: email,
        tags: tags,
      }),
    });

    if (!contactResponse.ok) {
      const errorData: SystemeApiError = await contactResponse.json().catch(() => ({}));
      console.error('Error creando contacto en Systeme.io:', errorData);
      
      // Si el contacto ya existe, intentamos actualizarlo
      if (contactResponse.status === 422) {
        return await updateContactTags(email, tags, apiKey);
      }
      
      return { 
        success: false, 
        error: errorData.message || `Error al crear contacto: ${contactResponse.status}` 
      };
    }

    const contact = await contactResponse.json();
    console.log(`Contacto añadido a Systeme.io: ${email} con tags: ${tags.join(', ')}`);
    
    return { success: true, contact };

  } catch (error) {
    console.error('Error en addContact:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Actualiza los tags de un contacto existente
 */
async function updateContactTags(
  email: string,
  tags: string[],
  apiKey: string
): Promise<{ success: boolean; contact?: SystemeContact; error?: string }> {
  try {
    // Primero buscamos el contacto por email
    const searchResponse = await fetch(
      `${SYSTEME_API_BASE}/contacts?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    if (!searchResponse.ok) {
      return { success: false, error: 'No se pudo encontrar el contacto existente' };
    }

    const searchData = await searchResponse.json();
    const contactId = searchData.items?.[0]?.id;

    if (!contactId) {
      return { success: false, error: 'Contacto no encontrado' };
    }

    // Actualizamos el contacto con los nuevos tags
    const updateResponse = await fetch(`${SYSTEME_API_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        tags: tags,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      return { success: false, error: errorData.message || 'Error actualizando contacto' };
    }

    const contact = await updateResponse.json();
    console.log(`Tags actualizados en Systeme.io para: ${email}`);
    
    return { success: true, contact };

  } catch (error) {
    console.error('Error en updateContactTags:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Añade un tag a un contacto específico
 * @param email - Email del contacto
 * @param tagName - Nombre del tag a aplicar
 */
export async function addTag(
  email: string,
  tagName: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.SYSTEME_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'SYSTEME_API_KEY no configurada' };
  }

  try {
    const result = await addContact(email, [tagName]);
    return { success: result.success, error: result.error };

  } catch (error) {
    console.error('Error en addTag:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Obtiene o crea un tag por nombre
 * Nota: Systeme.io crea tags automáticamente al asignarlos a contactos
 * @param tagName - Nombre del tag
 * @returns ID del tag o null
 */
export async function getOrCreateTag(tagName: string): Promise<string | null> {
  const apiKey = process.env.SYSTEME_API_KEY;
  
  if (!apiKey) {
    console.error('SYSTEME_API_KEY no configurada');
    return null;
  }

  try {
    // Listar tags existentes
    const response = await fetch(`${SYSTEME_API_BASE}/tags`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.error('Error listando tags:', await response.text());
      return null;
    }

    const data = await response.json();
    const existingTag = data.items?.find(
      (tag: { name: string; id: string }) => 
        tag.name.toLowerCase() === tagName.toLowerCase()
    );
    
    if (existingTag) {
      return existingTag.id;
    }

    // Crear nuevo tag
    const createResponse = await fetch(`${SYSTEME_API_BASE}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        name: tagName,
      }),
    });

    if (createResponse.ok) {
      const newTag = await createResponse.json();
      return newTag.id;
    }

    const errorData = await createResponse.json().catch(() => ({}));
    console.error('Error creando tag:', errorData);
    return null;

  } catch (error) {
    console.error('Error en getOrCreateTag:', error);
    return null;
  }
}

/**
 * Dispara una automatización específica para un contacto
 * Nota: Systeme.io maneja automatizaciones mediante tags
 * Cuando se aplica un tag, las automatizaciones asociadas se ejecutan automáticamente
 * @param email - Email del contacto
 * @param automationTriggerTag - Tag que dispara la automatización
 */
export async function triggerAutomation(
  email: string,
  automationTriggerTag: string
): Promise<{ success: boolean; error?: string }> {
  // En Systeme.io, las automatizaciones se disparan automáticamente al aplicar un tag
  // Por lo tanto, simplemente añadimos el tag al contacto
  return await addTag(email, automationTriggerTag);
}

/**
 * Obtiene todos los tags disponibles en la cuenta
 */
export async function listTags(): Promise<{ success: boolean; tags?: SystemeTag[]; error?: string }> {
  const apiKey = process.env.SYSTEME_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'SYSTEME_API_KEY no configurada' };
  }

  try {
    const response = await fetch(`${SYSTEME_API_BASE}/tags`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      return { success: false, error: `Error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, tags: data.items || [] };

  } catch (error) {
    console.error('Error listando tags:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Tags predefinidos para el flujo de ventas
 * NOTA: Plan gratuito de Systeme.io solo permite 1 tag
 * Por eso usamos el mismo tag para ambos productos
 */
export const SYSTEME_TAGS = {
  LEAD: 'lead',                    // Lead capturado (formulario previo a compra)
  COMPRA_GUIA: 'compro-guia',      // Tag único para todas las compras
  COMPRA_BUNDLE: 'compro-guia',    // Mismo tag (limitación plan gratuito)
} as const;

/**
 * ID de la automatización de email post-compra
 * Nota: Esto se configura manualmente en Systeme.io
 */
export const SYSTEME_AUTOMATIONS = {
  EMAIL_POST_COMPRA: 'email-post-compra', // Tag que dispara el email
} as const;

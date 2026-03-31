// Helper para interactuar con Kit.com API v4
// Documentación: https://developers.kit.com/

const KIT_API_BASE = 'https://api.kit.com/v4';

interface KitSubscriber {
  id: string | number;
  email_address: string;
  state: string;
  created_at: string;
}

interface KitApiResponse {
  subscriber: KitSubscriber;
}

interface KitTag {
  id: string | number;
  name: string;
}

interface KitTagResponse {
  tag: KitTag;
}

interface KitApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Añade un suscriptor a Kit con tags específicos
 * @param email - Email del suscriptor
 * @param tags - Array de nombres de tags a aplicar
 * @returns El suscriptor creado o actualizado
 */
export async function addSubscriber(
  email: string,
  tags: string[] = []
): Promise<{ success: boolean; subscriber?: KitSubscriber; error?: string }> {
  const apiKey = process.env.KIT_API_KEY;
  
  if (!apiKey) {
    console.error('KIT_API_KEY no está configurada');
    return { success: false, error: 'KIT_API_KEY no configurada' };
  }

  try {
    // Primero creamos/actualizamos el suscriptor
    const subscriberResponse = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': apiKey,
      },
      body: JSON.stringify({
        email_address: email,
        state: 'active',
      }),
    });

    if (!subscriberResponse.ok) {
      const errorData: KitApiError = await subscriberResponse.json();
      console.error('Error creando suscriptor en Kit:', errorData);
      return { 
        success: false, 
        error: errorData.message || 'Error al crear suscriptor' 
      };
    }

    const responseData: KitApiResponse = await subscriberResponse.json();
    const subscriber = responseData.subscriber;

    // Luego aplicamos los tags si hay alguno
    if (tags.length > 0) {
      for (const tagName of tags) {
        await applyTagToSubscriber(email, tagName, apiKey);
      }
    }

    console.log(`Suscriptor añadido a Kit: ${email} con tags: ${tags.join(', ')}`);
    return { success: true, subscriber };

  } catch (error) {
    console.error('Error en addSubscriber:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Aplica un tag a un suscriptor existente
 */
async function applyTagToSubscriber(
  email: string,
  tagName: string,
  apiKey: string
): Promise<boolean> {
  try {
    // Primero obtenemos o creamos el tag
    const tagId = await getOrCreateTag(tagName, apiKey);
    
    if (!tagId) {
      console.error(`No se pudo obtener/crear el tag: ${tagName}`);
      return false;
    }

    // Aplicamos el tag al suscriptor
    const response = await fetch(
      `${KIT_API_BASE}/tags/${tagId}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': apiKey,
        },
        body: JSON.stringify({
          email_address: email,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error aplicando tag ${tagName}:`, errorData);
      return false;
    }

    return true;

  } catch (error) {
    console.error(`Error aplicando tag ${tagName}:`, error);
    return false;
  }
}

/**
 * Obtiene un tag existente o lo crea si no existe
 */
async function getOrCreateTag(
  tagName: string,
  apiKey: string
): Promise<string | null> {
  try {
    // Primero buscamos el tag existente
    const listResponse = await fetch(
      `${KIT_API_BASE}/tags?per_page=100`,
      {
        headers: {
          'X-Kit-Api-Key': apiKey,
        },
      }
    );

    if (listResponse.ok) {
      const data = await listResponse.json();
      const existingTag = data.tags?.find(
        (tag: { name: string; id: string }) => 
          tag.name.toLowerCase() === tagName.toLowerCase()
      );
      
      if (existingTag) {
        return existingTag.id;
      }
    }

    // Si no existe, lo creamos
    const createResponse = await fetch(`${KIT_API_BASE}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': apiKey,
      },
      body: JSON.stringify({
        name: tagName,
      }),
    });

    if (createResponse.ok) {
      const newTag: KitTagResponse = await createResponse.json();
      return String(newTag.tag.id);
    }

    const errorData = await createResponse.json();
    console.error('Error creando tag:', errorData);
    return null;

  } catch (error) {
    console.error('Error en getOrCreateTag:', error);
    return null;
  }
}

/**
 * Tags predefinidos para el flujo de ventas
 */
export const KIT_TAGS = {
  LEAD: 'lead',              // Lead capturado (formulario previo a compra)
  COMPRA_GUIA: 'compro-guia',     // Compró solo la guía (€29)
  COMPRA_BUNDLE: 'compro-bundle', // Compró guía + sesión 1:1 (€127)
} as const;

// Integración con Brevo para emails transaccionales
// API v3: https://api.brevo.com/v3/smtp/email

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// IDs de listas de Brevo
// IMPORTANTE: Actualiza estos IDs con los reales de tu cuenta Brevo
// Puedes encontrarlos en Brevo > Contacts > Lists > (click en la lista) > ver URL o settings
export const BREVO_LIST_IDS = {
  LEADS: 7,           // Lista "Filmmakers Interesados - 7 Casos" (lead magnet)
  GUIA: 8,            // Lista "Compradores - Guía OpenClaw (29€)" - Dispara automation de 2 emails
  BUNDLE: 9,          // Lista "Compradores - Bundle + 1:1 (127€)" - Solo email transaccional
} as const;

// Template IDs de Brevo
export const BREVO_TEMPLATE_IDS = {
  GUIA: 1,    // Email para compradores solo de la guía
  BUNDLE: 2,  // Email para compradores del bundle (guía + sesión)
};

export interface SendEmailParams {
  to: string;
  toName?: string;
  templateId: number;
  params?: Record<string, string>;
}

/**
 * Envía un email transaccional via Brevo API usando plantilla
 */
export async function sendBrevoEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const {
    to,
    toName,
    templateId,
    params: templateParams = {},
  } = params;

  console.log('=== sendBrevoEmail INICIO ===');
  console.log('To:', to);
  console.log('Template ID:', templateId);
  console.log('BREVO_API_KEY existe:', !!BREVO_API_KEY);
  console.log('BREVO_API_KEY prefix:', BREVO_API_KEY ? BREVO_API_KEY.substring(0, 10) + '...' : 'MISSING');

  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY no configurada');
    return { success: false, error: 'BREVO_API_KEY no configurada' };
  }

  try {
    console.log('Haciendo request a Brevo API...');
    
    // Construir el body base
    const emailBody: Record<string, unknown> = {
      sender: {
        email: 'alberto@tuvideopromocional.es',
        name: 'Alberto Martín — OpenClaw para Filmmakers',
      },
      to: [
        {
          email: to,
          name: toName || to,
        },
      ],
      templateId,
    };
    
    // Añadir params solo si hay parámetros o si el template lo requiere
    // Brevo requiere que params tenga al menos una clave si se envía
    const hasParams = templateParams && Object.keys(templateParams).length > 0;
    if (hasParams) {
      emailBody.params = templateParams;
    } else {
      // Enviar un parametro dummy para evitar el error "params is blank"
      emailBody.params = { dummy: 'value' };
    }
    
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    console.log('Brevo response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Brevo API error:', response.status, errorData);
      return { success: false, error: `Brevo API error: ${response.status} - ${errorData}` };
    }

    const result = await response.json();
    console.log('✅ Email enviado via Brevo (template):', JSON.stringify(result));
    console.log('=== sendBrevoEmail FIN ===');
    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Exception enviando email via Brevo:', errorMessage);
    console.log('=== sendBrevoEmail FIN (con error) ===');
    return { success: false, error: errorMessage };
  }
}

/**
 * Envía email de bienvenida a comprador de guía
 */
export async function sendGuiaEmail(customerEmail: string): Promise<{ success: boolean; error?: string }> {
  return sendBrevoEmail({
    to: customerEmail,
    templateId: BREVO_TEMPLATE_IDS.GUIA,
  });
}

/**
 * Envía email de bienvenida a comprador de bundle
 */
export async function sendBundleEmail(customerEmail: string): Promise<{ success: boolean; error?: string }> {
  return sendBrevoEmail({
    to: customerEmail,
    templateId: BREVO_TEMPLATE_IDS.BUNDLE,
  });
}

/**
 * Añade o actualiza un contacto en Brevo y lo mete en una lista específica.
 * Útil para segmentar leads vs compradores de guía vs compradores de bundle.
 */
export async function addContactToBrevoList(
  email: string,
  listId: number,
  attributes?: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY no configurada');
    return { success: false, error: 'BREVO_API_KEY no configurada' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: attributes || {},
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204) {
      console.log(`✅ Contacto ${email} añadido/actualizado en lista ${listId}`);
      return { success: true };
    }

    // Si falla con 400, el contacto ya existe: actualizamos con PUT
    if (response.status === 400) {
      const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attributes: attributes || {},
          listIds: [listId],
        }),
      });

      if (updateResponse.ok || updateResponse.status === 204) {
        console.log(`✅ Contacto ${email} actualizado y añadido a lista ${listId}`);
        return { success: true };
      }

      const updateError = await updateResponse.text();
      console.error(`❌ Error PUT Brevo lista ${listId}:`, updateError);
      return { success: false, error: updateError };
    }

    const errorData = await response.text();
    console.error(`❌ Error Brevo lista ${listId}:`, errorData);
    return { success: false, error: errorData };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`❌ Exception añadiendo contacto a lista ${listId}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

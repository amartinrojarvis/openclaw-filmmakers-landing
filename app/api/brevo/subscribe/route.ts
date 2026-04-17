import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FALLBACK_DIR = path.join(process.cwd(), 'data', 'brevo-fallback');

async function saveLocalFallback(email: string, firstName: string, listId: number, attributes: Record<string, string>) {
  try {
    await fs.mkdir(FALLBACK_DIR, { recursive: true });
    const timestamp = Date.now();
    const filename = path.join(FALLBACK_DIR, `${timestamp}-${email.replace(/[@\\.]/g, '_')}.json`);
    const payload = {
      email,
      firstName,
      listId,
      attributes,
      savedAt: new Date().toISOString(),
    };
    await fs.writeFile(filename, JSON.stringify(payload, null, 2));
    console.log('✅ Lead guardado en fallback local:', filename);
    return true;
  } catch (err) {
    console.error('❌ Error guardando fallback local:', err);
    return false;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeName(name: string): string {
  return name.trim().substring(0, 100).replace(/[<>\"']/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 3 requests por IP cada 60 segundos
    const ip = getClientIp(request);
    const limit = rateLimit(`brevo-subscribe:${ip}`, 3, 60_000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentalo de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, firstName, listId, attributes = {} } = body;

    console.log('Recibido del frontend:', { email, firstName, listId, attributes });

    if (!email || !listId) {
      return NextResponse.json(
        { error: 'Email y listId son requeridos' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email no valido' },
        { status: 400 }
      );
    }

    // Preparar atributos correctamente - Brevo usa mayusculas para atributos por defecto
    const contactAttributes: Record<string, string> = {};

    // Solo añadir NOMBRE si tiene valor (atributo personalizado en Brevo)
    const nameToUse = sanitizeName(firstName || attributes.NOMBRE || attributes.nombre || attributes.FIRSTNAME || '');
    if (nameToUse && nameToUse.trim() !== '') {
      contactAttributes.NOMBRE = nameToUse.trim();
    }

    // Añadir otros atributos personalizados
    if (attributes.SOURCE) contactAttributes.SOURCE = attributes.SOURCE;
    if (attributes.VARIANT) contactAttributes.VARIANT = attributes.VARIANT;
    if (attributes.DATE_SUBSCRIBED) contactAttributes.DATE_SUBSCRIBED = attributes.DATE_SUBSCRIBED;

    // Si no hay API key configurada, fallback directo
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY no configurada, usando fallback local');
      const saved = await saveLocalFallback(email, nameToUse, listId, contactAttributes);
      if (saved) {
        return NextResponse.json({
          success: true,
          localFallback: true,
          message: 'Suscripcion guardada (modo local)',
        });
      }
      return NextResponse.json(
        { error: 'Error de configuracion' },
        { status: 500 }
      );
    }

    console.log('Enviando a Brevo:', { email, contactAttributes, listId });

    // Crear/actualizar contacto en Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: contactAttributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      let contactId: number | undefined;
      if (response.status !== 204) {
        try {
          const data = await response.json();
          contactId = data.id;
          console.log('Brevo response (nuevo contacto):', data);
        } catch {
          // 204 No Content o body vacio
        }
      }
      return NextResponse.json({
        success: true,
        message: 'Suscripcion exitosa',
        ...(contactId ? { contactId } : {}),
      });
    }

    // Si falla con 400, el contacto ya existe - actualizamos con PUT
    if (response.status === 400) {
      console.log('Contacto existe, actualizando con PUT...');
      const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          attributes: contactAttributes,
          listIds: [listId],
        }),
      });

      if (updateResponse.ok) {
        let updateData: any = {};
        if (updateResponse.status !== 204) {
          try {
            updateData = await updateResponse.json();
            console.log('Brevo response (update):', updateData);
          } catch {
            // 204 No Content o body vacio
          }
        }
        return NextResponse.json({
          success: true,
          message: 'Contacto actualizado y anadido a la lista',
        });
      }

      const updateError = await updateResponse.text();
      console.error('Error en PUT:', updateError);

      // Si el PUT tambien falla, guardamos fallback local
      const saved = await saveLocalFallback(email, nameToUse, listId, contactAttributes);
      if (saved) {
        return NextResponse.json({
          success: true,
          localFallback: true,
          message: 'Suscripcion guardada localmente por error temporal con Brevo',
        });
      }
    }

    // Cualquier otro error de Brevo: fallback local
    const errorData = await response.text();
    console.error('Error Brevo:', errorData);

    const saved = await saveLocalFallback(email, nameToUse, listId, contactAttributes);
    if (saved) {
      return NextResponse.json({
        success: true,
        localFallback: true,
        message: 'Suscripcion guardada localmente por error temporal con Brevo',
      });
    }

    return NextResponse.json(
      { error: 'Error al procesar la suscripcion' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error en subscribe:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, listId, attributes = {} } = body;

    console.log('Recibido del frontend:', { email, firstName, listId, attributes });

    if (!email || !listId) {
      return NextResponse.json(
        { error: 'Email y listId son requeridos' },
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY no configurada');
      return NextResponse.json(
        { error: 'Error de configuración' },
        { status: 500 }
      );
    }

    // Preparar atributos correctamente - Brevo usa mayúsculas para atributos por defecto
    const contactAttributes: Record<string, string> = {};
    
    // Solo añadir FIRSTNAME si tiene valor
    const nameToUse = firstName || attributes.FIRSTNAME || attributes.firstname || '';
    if (nameToUse && nameToUse.trim() !== '') {
      contactAttributes.FIRSTNAME = nameToUse.trim();
    }
    
    // Añadir otros atributos personalizados
    if (attributes.SOURCE) contactAttributes.SOURCE = attributes.SOURCE;
    if (attributes.VARIANT) contactAttributes.VARIANT = attributes.VARIANT;
    if (attributes.DATE_SUBSCRIBED) contactAttributes.DATE_SUBSCRIBED = attributes.DATE_SUBSCRIBED;

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
      const data = await response.json();
      console.log('Brevo response (nuevo contacto):', data);
      return NextResponse.json({ 
        success: true, 
        message: 'Suscripción exitosa',
        contactId: data.id 
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
        const updateData = await updateResponse.json();
        console.log('Brevo response (update):', updateData);
        return NextResponse.json({ 
          success: true, 
          message: 'Contacto actualizado y añadido a la lista' 
        });
      }
      
      const updateError = await updateResponse.text();
      console.error('Error en PUT:', updateError);
    }

    const errorData = await response.text();
    console.error('Error Brevo:', errorData);
    
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
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

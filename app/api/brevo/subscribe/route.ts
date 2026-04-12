import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, listId, attributes = {} } = body;

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
        attributes: {
          FIRSTNAME: firstName || attributes.FIRSTNAME,
          ...attributes,
        },
        listIds: [listId],
        updateEnabled: true, // Actualiza si ya existe
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Suscripción exitosa',
        contactId: data.id 
      });
    }

    // Si falla, intentamos con PUT (contacto ya existe)
    if (response.status === 400) {
      const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          attributes: {
            ...attributes,
          },
          listIds: [listId],
        }),
      });

      if (updateResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Contacto actualizado y añadido a la lista' 
        });
      }
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

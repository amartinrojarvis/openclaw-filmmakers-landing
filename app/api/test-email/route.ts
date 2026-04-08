// Endpoint de test para verificar envío de emails
import { NextRequest, NextResponse } from 'next/server';
import { sendGuiaEmail, sendBundleEmail } from '@/lib/brevo';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, type } = await request.json();
    
    console.log('=== TEST EMAIL ===');
    console.log('Email:', email);
    console.log('Type:', type);
    console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }
    
    let result;
    if (type === 'bundle') {
      result = await sendBundleEmail(email);
    } else {
      result = await sendGuiaEmail(email);
    }
    
    console.log('Result:', result);
    
    return NextResponse.json({
      success: result.success,
      error: result.error,
      env: {
        brevoKeyExists: !!process.env.BREVO_API_KEY,
        brevoKeyPrefix: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) : 'MISSING'
      }
    });
    
  } catch (error) {
    console.error('Error en test-email:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Endpoint de test para emails',
    brevoKeyExists: !!process.env.BREVO_API_KEY,
    brevoKeyPrefix: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) : 'MISSING'
  });
}

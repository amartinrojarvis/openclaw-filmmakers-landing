// Endpoint para depurar el webhook sin necesidad de hacer una compra real
import { NextRequest, NextResponse } from 'next/server';
import { sendGuiaEmail, sendBundleEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  console.log('=== DEBUG WEBHOOK ===');
  
  const body = await request.json();
  const { email, type } = body;
  
  console.log('Email:', email);
  console.log('Type:', type);
  console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
  
  try {
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
        brevoKeyPrefix: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) + '...' : null,
      }
    });
  } catch (error) {
    console.error('Exception:', error);
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}

// Debug endpoint v2

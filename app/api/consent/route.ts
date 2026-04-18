import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const LOG_DIR = path.join(process.cwd(), 'data', 'consent-logs');

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

async function saveConsentLog(payload: Record<string, unknown>) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const timestamp = Date.now();
    const identifier = (payload.ipHash as string) || 'unknown';
    const filename = path.join(LOG_DIR, `${timestamp}-${identifier.slice(0, 8)}.json`);
    await fs.writeFile(filename, JSON.stringify(payload, null, 2));
    return true;
  } catch (err) {
    console.error('Error guardando log de consentimiento:', err);
    return false;
  }
}

async function updateBrevoContact(email: string, consent: {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}) {
  if (!BREVO_API_KEY) return { success: false, reason: 'no_api_key' };
  try {
    const response = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        attributes: {
          CONSENT_ANALYTICS: String(consent.analytics),
          CONSENT_MARKETING: String(consent.marketing),
          CONSENT_TIMESTAMP: consent.timestamp,
        },
      }),
    });
    if (response.ok || response.status === 204) {
      return { success: true };
    }
    const text = await response.text();
    return { success: false, reason: 'brevo_error', status: response.status, text };
  } catch (err) {
    return { success: false, reason: 'exception', error: String(err) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`consent:${ip}`, 10, 60_000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentalo de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { necessary, analytics, marketing, timestamp, email } = body;

    if (typeof necessary !== 'boolean' || typeof analytics !== 'boolean' || typeof marketing !== 'boolean') {
      return NextResponse.json(
        { error: 'Formato de consentimiento invalido' },
        { status: 400 }
      );
    }

    const ipHash = hashIp(ip);
    const userAgent = request.headers.get('user-agent') || '';
    const logPayload = {
      necessary,
      analytics,
      marketing,
      timestamp: timestamp || new Date().toISOString(),
      email: email || null,
      ipHash,
      userAgent,
      savedAt: new Date().toISOString(),
    };

    const saved = await saveConsentLog(logPayload);

    let brevoResult: {
      success: boolean;
      reason?: string;
      status?: number;
      text?: string;
      error?: string;
    } = { success: false, reason: 'no_email' };
    if (email && typeof email === 'string') {
      brevoResult = await updateBrevoContact(email, {
        analytics,
        marketing,
        timestamp: timestamp || new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      saved,
      brevo: brevoResult.success,
    });
  } catch (error) {
    console.error('Error en /api/consent:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

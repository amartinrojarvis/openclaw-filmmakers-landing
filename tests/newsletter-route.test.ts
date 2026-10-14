import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/newsletter/route';

const previousKey = process.env.BREVO_API_KEY;

function request(body: unknown, ip: string) {
  return new NextRequest('http://localhost/api/newsletter', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

test.after(() => {
  if (previousKey === undefined) delete process.env.BREVO_API_KEY;
  else process.env.BREVO_API_KEY = previousKey;
});

test('falta BREVO_API_KEY devuelve 503', async () => {
  delete process.env.BREVO_API_KEY;
  const response = await POST(request({ email: 'ana@ejemplo.com', honeypot: '' }, '203.0.113.10'));
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.match(payload.error, /BREVO_API_KEY/);
});

test('rechaza un email inválido', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  const response = await POST(request({ email: 'no-es-un-email', honeypot: '' }, '203.0.113.11'));
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.equal(payload.error, 'Escribe un email válido.');
});

test('el honeypot no llama a Brevo', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  let called = false;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    called = true;
    return new Response(null, { status: 201 });
  };
  try {
    const response = await POST(request({ email: 'ana@ejemplo.com', honeypot: 'spam' }, '203.0.113.12'));
    assert.equal(response.status, 200);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = original;
  }
});

test('201 y 204 de Brevo son alta correcta y el cuerpo es el pedido', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  const seen: Array<{ status: number; apiKey: string; body: unknown }> = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    seen.push({
      status: seen.length === 0 ? 201 : 204,
      apiKey: headers.get('api-key') || '',
      body: JSON.parse(String(init?.body)),
    });
    assert.equal(String(input), 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
    return new Response(null, { status: seen.at(-1)?.status });
  };
  try {
    const created = await POST(request({ email: ' ana@ejemplo.com ', honeypot: '' }, '203.0.113.13'));
    const empty = await POST(request({ email: 'ana@ejemplo.com', honeypot: '   ' }, '203.0.113.14'));
    assert.equal(created.status, 200);
    assert.equal(empty.status, 200);
    assert.deepEqual(seen[0]?.body, {
      email: 'ana@ejemplo.com',
      includeListIds: [18],
      templateId: 27,
      redirectionUrl: 'https://www.iaparafilmmakers.es/casos-de-uso-vibe-coding?alta=ok',
    });
    assert.equal(seen[0]?.apiKey, 'test-key');
    assert.equal(seen[1]?.status, 204);
  } finally {
    globalThis.fetch = original;
  }
});

test('un fallo de Brevo devuelve un error en español', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('nope', { status: 400 });
  try {
    const response = await POST(request({ email: 'ana@ejemplo.com', honeypot: '' }, '203.0.113.15'));
    const payload = await response.json();
    assert.equal(response.status, 502);
    assert.match(payload.error, /No he podido apuntarte/);
  } finally {
    globalThis.fetch = original;
  }
});

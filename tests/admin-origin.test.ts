import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveTrustedAdminOrigin } from '../lib/admin-origin';

const TAILSCALE = 'https://kairos.tailbb2482.ts.net';

test('acepta el origen HTTPS exacto de Tailscale aunque Next vea localhost', () => {
  assert.equal(
    resolveTrustedAdminOrigin('http://localhost:3013/api/admin/auth/request', TAILSCALE, undefined),
    TAILSCALE,
  );
});

test('acepta el mismo origen directo para desarrollo local', () => {
  assert.equal(
    resolveTrustedAdminOrigin('http://localhost:3013/api/admin/auth/request', 'http://localhost:3013', undefined),
    'http://localhost:3013',
  );
});

test('rechaza orígenes externos aunque se ejecuten detrás del proxy', () => {
  assert.equal(
    resolveTrustedAdminOrigin('http://localhost:3013/api/admin/auth/request', 'https://evil.example', undefined),
    null,
  );
});

test('en previews acepta únicamente dominios HTTPS de Vercel', () => {
  assert.equal(
    resolveTrustedAdminOrigin('http://localhost:3000/api/admin/auth/request', 'https://feature-123.vercel.app', 'preview'),
    'https://feature-123.vercel.app',
  );
  assert.equal(
    resolveTrustedAdminOrigin('http://localhost:3000/api/admin/auth/request', 'https://feature-123.vercel.app.evil.example', 'preview'),
    null,
  );
});

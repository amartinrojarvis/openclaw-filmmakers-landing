import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADMIN_EMAIL,
  createAdminSessionToken,
  createMagicLinkToken,
  verifyAdminSessionToken,
  verifyMagicLinkToken,
} from '../lib/admin-auth-token';

const SECRET = 'test-secret-with-more-than-thirty-two-characters';
const NOW = Date.UTC(2026, 6, 14, 12, 0, 0);

test('el enlace mágico solo valida para el correo administrador y antes de expirar', () => {
  const token = createMagicLinkToken(SECRET, NOW, 'fixed-nonce');
  const payload = verifyMagicLinkToken(token, SECRET, NOW + 60_000);
  assert.equal(payload?.email, ADMIN_EMAIL);
  assert.equal(verifyMagicLinkToken(token, 'otro-secreto-de-pruebas-muy-largo-123', NOW + 60_000), null);
  assert.equal(verifyMagicLinkToken(token, SECRET, NOW + 16 * 60_000), null);
});

test('la cookie de administrador dura doce horas y tiene propósito separado', () => {
  const token = createAdminSessionToken(SECRET, NOW);
  assert.equal(verifyAdminSessionToken(token, SECRET, NOW + 11 * 60 * 60_000)?.email, ADMIN_EMAIL);
  assert.equal(verifyAdminSessionToken(token, SECRET, NOW + 13 * 60 * 60_000), null);
  assert.equal(verifyMagicLinkToken(token, SECRET, NOW), null);
});

test('rechaza tokens manipulados', () => {
  const token = createMagicLinkToken(SECRET, NOW, 'fixed-nonce');
  const changed = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;
  assert.equal(verifyMagicLinkToken(changed, SECRET, NOW), null);
});

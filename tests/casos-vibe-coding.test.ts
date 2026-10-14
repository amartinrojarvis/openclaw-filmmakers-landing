import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CASOS, CASOS_CATALOGO_TOTAL, getCaso, relatedCasos } from '../lib/casos-vibe-coding';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reservedPhrase = 'En un documental deportivo se pidió recuperar el documental largo';
const reservedSlug = 'localizar-y-abrir-la-version-vigente';

test('el directorio publicado tiene 43 casos y no incluye la reserva', () => {
  assert.equal(CASOS.length, 43);
  assert.equal(CASOS_CATALOGO_TOTAL, 122);
  assert.equal(new Set(CASOS.map((caso) => caso.id)).size, 43);
  assert.equal(getCaso('crear-un-proyecto-de-edicion-desde-una-peticion')?.plano, 'PLANO 001');
  assert.equal(getCaso(reservedSlug), undefined);
  assert.equal(JSON.stringify(CASOS).includes(reservedPhrase), false);
  assert.equal(JSON.stringify(CASOS).includes('"publicado"'), false);

  for (const caso of CASOS) {
    assert.ok(caso.t && caso.p && caso.plano);
    for (const related of relatedCasos(caso)) {
      assert.equal(CASOS.includes(related), true);
    }
  }
});

test('ningún archivo enviado del directorio contiene un caso de reserva', () => {
  const files = [
    'lib/casos-vibe-coding.json',
    'lib/casos-vibe-coding.ts',
    'app/casos-de-uso-vibe-coding/directory.tsx',
    'app/casos-de-uso-vibe-coding/[slug]/page.tsx',
  ];
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal(text.includes(reservedPhrase), false, file);
    assert.equal(text.includes(reservedSlug), false, file);
  }
});

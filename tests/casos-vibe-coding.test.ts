import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CASOS, CASOS_CATALOGO_TOTAL, getCaso, relatedCasos } from '../lib/casos-vibe-coding';
import { SAVED_CASOS_KEY, parseSavedIds } from '../app/casos-de-uso-vibe-coding/saved-casos';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reservedPhrase = 'En un documental deportivo se pidió recuperar el documental largo';
const reservedSlug = 'localizar-y-abrir-la-version-vigente';

test('el directorio publicado tiene 52 casos y no incluye la reserva', () => {
  assert.equal(CASOS.length, 52);
  assert.equal(CASOS_CATALOGO_TOTAL, 123);
  assert.equal(new Set(CASOS.map((caso) => caso.id)).size, 52);
  assert.equal(getCaso('crear-un-proyecto-de-edicion-desde-una-peticion')?.plano, 'Caso 001');
  assert.equal(getCaso('conectar-filmcraft-con-codex-mcp')?.plano, 'Caso 123');
  assert.equal(getCaso('conectar-filmcraft-con-codex-mcp')?.clave, true);
  assert.equal(getCaso('aplicar-la-identidad-visual-del-cliente')?.clave, true);
  assert.equal(CASOS.filter((caso) => caso.clave).length, 15);
  assert.equal(CASOS.every((caso) => caso.plano.startsWith('Caso ')), true);
  assert.equal(getCaso(reservedSlug), undefined);
  assert.equal(JSON.stringify(CASOS).includes(reservedPhrase), false);
  assert.equal(JSON.stringify(CASOS).includes('"publicado"'), false);
  assert.equal(JSON.stringify(CASOS).includes('PLANO '), false);

  for (const caso of CASOS) {
    assert.ok(caso.t && caso.p && caso.plano);
    assert.equal(caso.tools.includes('ChatGPT (Codex)'), true);
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
    'app/casos-de-uso-vibe-coding/saved-casos.ts',
    'app/casos-de-uso-vibe-coding/save-caso.tsx',
  ];
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal(text.includes(reservedPhrase), false, file);
    assert.equal(text.includes(reservedSlug), false, file);
  }
});

test('los guardados se leen de iaf-casos-guardados y descartan ids ajenos', () => {
  const known = new Set(['crear-un-proyecto-de-edicion-desde-una-peticion', 'importar-y-clasificar-los-brutos']);
  assert.equal(SAVED_CASOS_KEY, 'iaf-casos-guardados');
  assert.deepEqual(parseSavedIds(null, known), []);
  assert.deepEqual(parseSavedIds('{', known), []);
  assert.deepEqual(parseSavedIds('"no"', known), []);
  assert.deepEqual(
    parseSavedIds(JSON.stringify([
      'importar-y-clasificar-los-brutos',
      'importar-y-clasificar-los-brutos',
      'localizar-y-abrir-la-version-vigente',
      3,
    ]), known),
    ['importar-y-clasificar-los-brutos'],
  );
});

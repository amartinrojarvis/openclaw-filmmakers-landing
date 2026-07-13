import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalSection } from '@/components/LegalSection';
import { OpenCookieSettings } from '@/components/OpenCookieSettings';
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Política de cookies',
  description: 'Gestión de cookies necesarias, analíticas y de marketing en IA para Filmmakers.',
};

const rows = [
  ['iapf_cookie_consent_v2', 'IA para Filmmakers', 'Preferencias de consentimiento', 'Necesaria', '6 meses', 'Al decidir'],
  ['iapf_consent_proof', 'IA para Filmmakers', 'Prueba técnica de la decisión y versión', 'Necesaria · HttpOnly', '6 meses', 'Al decidir'],
  ['__stripe_mid', 'Stripe, Inc.', 'Prevención de fraude en el pago', 'Necesaria', '1 año', 'Al abrir Stripe'],
  ['__stripe_sid', 'Stripe, Inc.', 'Sesión y prevención de fraude', 'Necesaria', '30 minutos', 'Al abrir Stripe'],
  ['_ga / _ga_*', 'Google LLC', 'Distinguir usuarios y sesiones', 'Analítica', 'Hasta 2 años', 'Solo con permiso'],
  ['_gid', 'Google LLC', 'Distinguir usuarios', 'Analítica', '24 horas', 'Solo con permiso'],
  ['_gat', 'Google LLC', 'Limitar solicitudes', 'Analítica', '1 minuto', 'Solo con permiso'],
  ['_fbp / _fbc', 'Meta Platforms, Inc.', 'Medición y atribución publicitaria', 'Marketing', 'Hasta 3 meses', 'Solo con permiso'],
];

export default function CookiesPage() {
  return (
    <PageLayout>
      <article className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <header className="grid gap-8 pb-16 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">RGPD · ePrivacy · LSSI</p>
          <div><h1 className="font-editorial max-w-5xl text-balance text-[clamp(3.4rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.06em]">Política de cookies.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#f2eee5]/55">Tú decides si se cargan la analítica y la medición publicitaria. Ambas permanecen bloqueadas por defecto.</p></div>
        </header>

        <div className="space-y-12">
          <LegalSection title="1. Qué son">
            <p>Las cookies y tecnologías similares permiten recordar preferencias, proteger pagos y, si das permiso, medir cómo se utiliza una web. Las necesarias se usan para funciones solicitadas; las demás requieren consentimiento previo.</p>
          </LegalSection>

          <LegalSection title="2. Tus opciones">
            <div className="grid gap-px border border-[#f2eee5]/20 bg-[#f2eee5]/20 sm:grid-cols-3">
              <div className="bg-[#171612] p-5"><p className="font-black text-[#f2eee5]">Necesarias</p><p className="mt-3 text-sm leading-6">Preferencias, seguridad y pago. No se pueden desactivar desde el gestor.</p></div>
              <div className="bg-[#171612] p-5"><p className="font-black text-[#f2eee5]">Analítica</p><p className="mt-3 text-sm leading-6">Google Analytics. Desactivado por defecto.</p></div>
              <div className="bg-[#171612] p-5"><p className="font-black text-[#f2eee5]">Marketing</p><p className="mt-3 text-sm leading-6">Meta Pixel para medir campañas. Desactivado por defecto.</p></div>
            </div>
          </LegalSection>

          <LegalSection title="3. Cookies y tecnologías">
            <div className="overflow-x-auto border border-[#f2eee5]/20">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#f2eee5] text-[#171612]"><tr>{['Nombre','Entidad','Finalidad','Categoría','Duración','Activación'].map((item) => <th key={item} className="p-4 font-extrabold">{item}</th>)}</tr></thead>
                <tbody className="divide-y divide-[#f2eee5]/15 text-[#f2eee5]/58">
                  {rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="p-4 align-top">{cell}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <p>Stripe puede utilizar tecnologías adicionales en su dominio para seguridad, autenticación y prevención de fraude. Sus nombres pueden variar según el navegador y el método de pago.</p>
          </LegalSection>

          <LegalSection title="4. Consentimiento y retirada">
            <p>El gestor ofrece “Aceptar todas” y “Rechazar no esenciales” con la misma visibilidad, sin casillas premarcadas. Puedes elegir categorías por separado. La decisión se guarda durante seis meses, junto a la versión de esta política y una referencia técnica de consentimiento.</p>
            <p>Retirar una categoría impide futuras cargas y elimina, cuando el navegador lo permite, cookies conocidas de Google y Meta. También puedes borrarlas desde la configuración del navegador.</p>
            <div className="border border-[#f2eee5]/20 bg-[#f2eee5] p-5 text-[#171612]"><OpenCookieSettings /></div>
          </LegalSection>

          <LegalSection title="5. Transferencias internacionales">
            <p>Google LLC, Meta Platforms, Inc., Stripe, Inc. y Vercel Inc. pueden tratar datos fuera del Espacio Económico Europeo. Se aplican las garantías previstas en el RGPD, incluido el Marco de Privacidad de Datos UE–EE. UU., decisiones de adecuación o cláusulas contractuales tipo, según corresponda.</p>
          </LegalSection>

          <LegalSection title="6. Más información">
            <p>Consulta la <Link href="/privacidad">política de privacidad</Link>. Para dudas o ejercicio de derechos, escribe a <a href="mailto:alberto@tuvideopromocional.es">alberto@tuvideopromocional.es</a>.</p>
          </LegalSection>
        </div>
        <p className="mt-16 border-t border-[#f2eee5]/20 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2eee5]/32">Última actualización: 13 de julio de 2026 · Versión 2026-07-v2.</p>
      </article>
    </PageLayout>
  );
}

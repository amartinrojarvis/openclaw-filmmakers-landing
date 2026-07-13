import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalSection } from '@/components/LegalSection';
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Información sobre el tratamiento de datos en IA para Filmmakers y la asesoría individual.',
};

export default function PrivacidadPage() {
  return (
    <PageLayout>
      <article className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <header className="grid gap-8 pb-16 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Protección de datos</p>
          <div><h1 className="font-editorial max-w-5xl text-balance text-[clamp(3.4rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.06em]">Política de privacidad.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#f2eee5]/55">Qué información se utiliza, para qué y cómo puedes ejercer tus derechos.</p></div>
        </header>

        <div className="space-y-12">
          <LegalSection title="1. Responsable">
            <p><strong>Responsable:</strong> Alberto Martín · Salamanca, España.</p>
            <p><strong>Email:</strong> <a href="mailto:alberto@tuvideopromocional.es">alberto@tuvideopromocional.es</a>.</p>
            <p><strong>Sitio web:</strong> https://www.iaparafilmmakers.es.</p>
          </LegalSection>

          <LegalSection title="2. Datos tratados">
            <ul>
              <li><strong>Compra y facturación:</strong> nombre, email, dirección, identificación fiscal cuando proceda, importe y referencia. Stripe trata los datos de tarjeta; esta web no los almacena.</li>
              <li><strong>Preparación:</strong> actividad, web o perfil, experiencia con IA, problema prioritario, herramientas, disponibilidad y contexto que decidas facilitar.</li>
              <li><strong>Comunicaciones:</strong> mensajes necesarios para confirmar, prestar y hacer seguimiento del servicio.</li>
              <li><strong>Navegación:</strong> datos técnicos y eventos de uso únicamente según tus preferencias de cookies.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Finalidad y base jurídica">
            <ul>
              <li><strong>Gestionar el pago y prestar la sesión:</strong> ejecución del contrato.</li>
              <li><strong>Facturación y obligaciones fiscales:</strong> cumplimiento de obligaciones legales.</li>
              <li><strong>Responder consultas, prevenir fraude y proteger la web:</strong> interés legítimo y, cuando corresponda, ejecución del contrato.</li>
              <li><strong>Analítica y publicidad:</strong> consentimiento previo, que puedes rechazar o retirar desde el gestor.</li>
              <li><strong>Comunicaciones comerciales:</strong> solo con consentimiento específico o base legal aplicable. Comprar no implica suscribirse a una newsletter.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Proveedores">
            <p>No se venden datos personales. Para operar el servicio se utilizan:</p>
            <ul>
              <li><strong>Stripe, Inc.:</strong> pagos, prevención de fraude y cálculo de impuestos.</li>
              <li><strong>Brevo / Sendinblue SAS:</strong> emails transaccionales y gestión operativa.</li>
              <li><strong>Vercel Inc.:</strong> alojamiento y ejecución de la web.</li>
              <li><strong>Google LLC y Meta Platforms, Inc.:</strong> únicamente cuando aceptas analítica o marketing.</li>
            </ul>
            <p>Cuando exista una transferencia internacional se aplicarán las garantías del RGPD, como decisiones de adecuación, el Marco de Privacidad de Datos UE–EE. UU. o cláusulas contractuales tipo.</p>
          </LegalSection>

          <LegalSection title="5. Conservación">
            <p>Los datos contractuales y de facturación se conservan durante los plazos exigidos por la normativa fiscal y mercantil. El formulario y las comunicaciones se conservan mientras resulten necesarios para prestar el servicio, resolver incidencias y atender responsabilidades.</p>
            <p>Los datos comerciales se conservan hasta retirar el consentimiento. Las preferencias de cookies se solicitan de nuevo al cambiar su versión o, como máximo, a los seis meses. Consulta la <Link href="/cookies">política de cookies</Link>.</p>
          </LegalSection>

          <LegalSection title="6. Derechos">
            <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad, y retirar el consentimiento cuando el tratamiento dependa de él.</p>
            <p>Escribe a <a href="mailto:alberto@tuvideopromocional.es">alberto@tuvideopromocional.es</a> indicando tu solicitud y la información necesaria para verificar tu identidad. También puedes reclamar ante la <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a>.</p>
          </LegalSection>

          <LegalSection title="7. Seguridad">
            <p>La web utiliza HTTPS, controles de acceso, minimización de datos y proveedores especializados. No se toman decisiones automatizadas con efectos jurídicos sobre las personas a partir del formulario.</p>
          </LegalSection>

          <LegalSection title="8. Información de trabajo">
            <p>Evita compartir contraseñas, datos bancarios o datos personales de clientes que no sean necesarios. Es preferible anonimizar los ejemplos. No se publicará tu caso ni un testimonio sin autorización expresa.</p>
          </LegalSection>
        </div>
        <p className="mt-16 border-t border-[#f2eee5]/20 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2eee5]/32">Última actualización: 13 de julio de 2026.</p>
      </article>
    </PageLayout>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalSection } from '@/components/LegalSection';
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Condiciones de contratación',
  description: 'Precio, alcance, reserva, cambios y cancelaciones de la sesión 1:1 de IA para Filmmakers.',
};

export default function CondicionesPage() {
  return (
    <PageLayout>
      <article className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <header className="grid gap-8 pb-16 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Información contractual</p>
          <div><h1 className="font-editorial max-w-5xl text-balance text-[clamp(3.4rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.06em]">Condiciones de contratación.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#f2eee5]/55">Regulan la reserva de la sesión individual para orientar y desarrollar usos propios de IA en el trabajo audiovisual.</p></div>
        </header>

        <div className="space-y-12">
          <LegalSection title="1. Prestador">
            <p><strong>Prestador:</strong> Alberto Martín · Salamanca, España.</p>
            <p><strong>Contacto:</strong> <a href="mailto:alberto@tuvideopromocional.es">alberto@tuvideopromocional.es</a>.</p>
          </LegalSection>

          <LegalSection title="2. Servicio">
            <p>Una sesión online individual de 90 minutos orientada a estudiar el caso de cada profesional audiovisual, identificar dónde puede aportar valor la IA y ayudar a diseñar un proceso o una herramienta propia para un caso de uso concreto.</p>
            <p>Incluye formulario previo, preparación breve, trabajo práctico durante la sesión, una hoja de ruta resumida y una consulta corta durante los siete días posteriores.</p>
            <p>La modalidad de acompañamiento añade dos sesiones online de seguimiento de 45 minutos, hasta cuatro consultas breves por email, revisión del flujo o prototipo y ajustes de la hoja de ruta durante los 30 días posteriores a la sesión inicial. Las consultas no utilizadas caducan al finalizar ese periodo.</p>
            <p>Cuando el alcance y el tiempo lo permitan, se podrá construir un prototipo o primera versión funcional. La sesión no incluye un desarrollo de software completo, integraciones complejas, entrega de una aplicación terminada ni soporte indefinido.</p>
            <p>El acompañamiento tampoco incluye ejecución por parte de Alberto, mantenimiento, disponibilidad urgente ni mensajería ilimitada. Las respuestas por email se realizarán en un máximo de 48 horas laborables.</p>
          </LegalSection>

          <LegalSection title="3. Oferta de lanzamiento">
            <p>El precio de lanzamiento de la sesión estratégica es de <strong>75 € precio final</strong>. La modalidad que incorpora acompañamiento durante 30 días cuesta <strong>199 € precio final</strong>.</p>
            <p>Los importes mostrados son los totales que se cobran en el checkout; Stripe no añade IVA al total indicado. Los impuestos se consideran incluidos cuando resulten aplicables.</p>
            <p>Es una edición limitada a cinco compras entre ambas modalidades y destinada a validar el formato de trabajo; no constituye una tarifa permanente. Stripe procesa el pago y esta web no almacena datos de tarjeta.</p>
            <p>La plaza se considera reservada cuando Stripe confirma el pago.</p>
          </LegalSection>

          <LegalSection title="4. Fecha de la sesión">
            <p>Después del pago, la persona compradora debe completar el formulario previo y proponer al menos tres opciones de día y horario indicando su zona horaria.</p>
            <p>Alberto confirmará una fecha o propondrá alternativas por email en un máximo de 48 horas laborables. Salvo acuerdo diferente, la sesión debe celebrarse dentro de los 60 días posteriores a la compra.</p>
          </LegalSection>

          <LegalSection title="5. Cambios y cancelaciones">
            <ul>
              <li>Puede solicitarse un cambio de fecha de cualquiera de las sesiones sin coste avisando con al menos 24 horas, sujeto a disponibilidad y, en el acompañamiento, al plazo contratado de 30 días.</li>
              <li>Una cancelación comunicada con al menos 48 horas de antelación a la sesión inicial y antes de comenzar el servicio da derecho al reembolso del importe abonado.</li>
              <li>Las cancelaciones con menos de 48 horas, los cambios con menos de 24 horas y las ausencias no dan derecho automático a reembolso, salvo fuerza mayor acreditada.</li>
              <li>Una vez celebrada la sesión inicial, la cancelación voluntaria de los seguimientos restantes no da derecho automático al reembolso íntegro del pack, sin perjuicio de los derechos legales aplicables.</li>
              <li>Si Alberto no pudiera prestar el servicio, la persona podrá elegir entre nuevas fechas, el reembolso íntegro si el servicio no hubiera comenzado o el reembolso proporcional de la parte no prestada.</li>
            </ul>
          </LegalSection>

          <LegalSection title="6. Desistimiento">
            <p>Cuando resulte aplicable la normativa de consumo, la persona compradora dispone de 14 días naturales para desistir, siempre que el servicio no se haya ejecutado completamente.</p>
            <p>Si solicita expresamente que el servicio comience dentro de ese plazo, acepta su inicio anticipado. Si desiste después de que haya comenzado pero antes de su ejecución completa, podrá corresponder el abono proporcional de la parte ya prestada. Una vez prestado íntegramente, el derecho se extingue conforme a la normativa aplicable. Los derechos imperativos de consumidores y usuarios prevalecen.</p>
          </LegalSection>

          <LegalSection title="7. Alcance y resultados">
            <p>La sesión ofrece orientación y trabajo práctico adaptado a la información facilitada. No garantiza resultados económicos, un ahorro concreto, una automatización completa ni la compatibilidad permanente de servicios de terceros.</p>
            <p>Las decisiones empresariales, creativas, legales o técnicas posteriores corresponden a la persona contratante.</p>
          </LegalSection>

          <LegalSection title="8. Propiedad y confidencialidad">
            <p>Las plantillas, diseños o instrucciones entregados pueden utilizarse en la actividad profesional de la persona contratante, pero no revenderse ni distribuirse como producto propio.</p>
            <p>Alberto tratará como confidencial la información empresarial compartida para preparar la sesión, excepto cuando exista obligación legal o autorización expresa para utilizar el caso.</p>
          </LegalSection>

          <LegalSection title="9. Datos y legislación">
            <p>Los datos se tratan conforme a la <Link href="/privacidad">política de privacidad</Link>. Para cualquier incidencia se recomienda contactar primero por email.</p>
            <p>Estas condiciones se rigen por la legislación española, sin perjuicio de los fueros y derechos imperativos que correspondan a consumidores y usuarios.</p>
          </LegalSection>
        </div>
        <p className="mt-16 border-t border-[#f2eee5]/20 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2eee5]/32">Última actualización: 13 de julio de 2026.</p>
      </article>
    </PageLayout>
  );
}

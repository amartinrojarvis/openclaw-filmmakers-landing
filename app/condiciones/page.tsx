import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalSection } from '@/components/LegalSection';
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Condiciones de contratación',
  description: 'Precio, alcance, reserva, suscripción, cambios y cancelaciones de los servicios de IA para Filmmakers.',
};

export default function CondicionesPage() {
  return (
    <PageLayout>
      <article className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <header className="grid gap-8 pb-16 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5a2a]">Información contractual</p>
          <div><h1 className="font-editorial max-w-5xl text-balance text-[clamp(3.4rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.06em]">Condiciones de contratación.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#f2eee5]/55">Regulan la sesión individual y la suscripción mensual para construir sistemas de IA aplicados al trabajo audiovisual.</p></div>
        </header>

        <div className="space-y-12">
          <LegalSection title="1. Prestador">
            <p><strong>Prestador:</strong> Alberto Martín · Salamanca, España.</p>
            <p><strong>Contacto:</strong> <a href="mailto:alberto@tuvideopromocional.es">alberto@tuvideopromocional.es</a>.</p>
          </LegalSection>

          <LegalSection title="2. Servicios">
            <p>La sesión estratégica es una sesión online individual de 90 minutos orientada a estudiar el caso de cada profesional audiovisual, revisar los cinco sistemas de su negocio, priorizarlos en el mapa y trabajar sobre una solución concreta.</p>
            <p>Incluye formulario previo, preparación breve, trabajo práctico durante la sesión, el mapa de los cinco sistemas priorizado y una consulta corta durante los siete días posteriores.</p>
            <p>La suscripción mensual comienza con un primer mes de implementación. Incluye revisión previa del briefing, sesión de diagnóstico y construcción de 90 minutos, el mapa priorizado, el primer sistema montado y funcionando, un seguimiento online de 45 minutos y hasta cuatro consultas por email. Las respuestas por email se realizarán en un máximo de 48 horas laborables.</p>
            <p>Cada mes siguiente incluye un sistema nuevo del mapa construido en una sesión online de entre 45 y 60 minutos, mantenimiento de lo ya construido, hasta cuatro consultas por email y una nota sobre cambios relevantes en IA para el caso del cliente.</p>
            <p>Los servicios no incluyen desarrollo completo de software, integraciones complejas, ejecución por parte de Alberto, disponibilidad urgente, mensajería ilimitada ni soporte indefinido. Los costes de herramientas, licencias y APIs de terceros los asume el cliente.</p>
          </LegalSection>

          <LegalSection title="3. Oferta de lanzamiento">
            <p>El precio de lanzamiento de la sesión estratégica es de <strong>75 € precio final</strong>. El precio previsto para nuevas reservas después del piloto es de <strong>149 €</strong>.</p>
            <p>El primer mes de la suscripción cuesta <strong>199 € precio final</strong>. Su precio habitual previsto es de <strong>349 €</strong>. A partir del segundo mes, quienes entren durante el piloto pagan <strong>149 €/mes</strong> en lugar del precio habitual previsto de <strong>199 €/mes</strong>, con las condiciones del apartado siguiente.</p>
            <p>Los importes mostrados son los totales que se cobran en el checkout; Stripe no añade IVA al total indicado. Los impuestos se consideran incluidos cuando resulten aplicables.</p>
            <p>Es una edición piloto limitada a cinco plazas entre ambas modalidades. Cuando estén cubiertas, no se admitirán nuevas reservas o altas hasta que se comunique nueva disponibilidad. Stripe procesa los cargos y esta web no almacena datos de tarjeta.</p>
            <p>La plaza se considera reservada cuando Stripe confirma el primer pago.</p>
          </LegalSection>

          {/* <!-- PENDIENTE REVISIÓN LEGAL --> */}
          <span className="hidden" aria-hidden="true" dangerouslySetInnerHTML={{ __html: '<!-- PENDIENTE REVISIÓN LEGAL -->' }} />
          <LegalSection title="4. Suscripción, renovación y cancelación">
            <p>La modalidad de continuidad es una suscripción mensual recurrente. Se activa con el pago de <strong>199 €</strong> correspondiente al primer mes y se renueva automáticamente cada mes mediante Stripe por <strong>149 €/mes</strong> mientras se mantenga activa.</p>
            <p>No hay permanencia. El cliente puede cancelar desde el portal de cliente de Stripe. La cancelación evita la siguiente renovación y produce efecto al terminar el periodo ya pagado. No implica el reembolso del periodo en curso, sin perjuicio de los derechos legales que resulten aplicables.</p>
            <p>Quien contrate durante el piloto conserva el precio de <strong>149 €/mes</strong> mientras la suscripción permanezca activa de forma continuada. Si cancela y vuelve a contratar más adelante, se aplicará el precio vigente para nuevas altas en ese momento.</p>
            <p>Al finalizar la suscripción cesan las nuevas sesiones, consultas y tareas de mantenimiento. Los materiales, documentos y sistemas ya construidos para el cliente permanecen en su poder y puede seguir utilizándolos.</p>
            <p>El límite de plazas se aplica a nuevas altas. Alcanzar el cupo no interrumpe las suscripciones que ya estén activas.</p>
          </LegalSection>

          <LegalSection title="5. Fecha de las sesiones">
            <p>Después del primer pago, la persona compradora debe completar el formulario previo y proponer al menos tres opciones de día y horario indicando su zona horaria.</p>
            <p>Alberto confirmará una fecha o propondrá alternativas por email en un máximo de 48 horas laborables. Salvo acuerdo diferente, la sesión inicial debe celebrarse dentro de los 60 días posteriores a la compra.</p>
            <p>Las sesiones de continuidad se acuerdan durante cada periodo mensual, según la disponibilidad de ambas partes.</p>
          </LegalSection>

          <LegalSection title="6. Cambios y cancelaciones de sesiones">
            <ul>
              <li>Puede solicitarse un cambio de fecha de cualquiera de las sesiones sin coste avisando con al menos 24 horas, sujeto a disponibilidad.</li>
              <li>En la sesión estratégica suelta, una cancelación comunicada con al menos 48 horas de antelación y antes de comenzar el servicio da derecho al reembolso del importe abonado.</li>
              <li>Las cancelaciones con menos de 48 horas, los cambios con menos de 24 horas y las ausencias no dan derecho automático a reembolso, salvo fuerza mayor acreditada.</li>
              <li>La cancelación de la suscripción se rige por el apartado 4 y no cancela automáticamente una sesión ya acordada dentro del periodo pagado.</li>
              <li>Si Alberto no pudiera prestar el servicio, la persona podrá elegir entre nuevas fechas, el reembolso íntegro si el servicio no hubiera comenzado o el reembolso proporcional de la parte no prestada.</li>
            </ul>
          </LegalSection>

          <LegalSection title="7. Desistimiento">
            <p>Cuando resulte aplicable la normativa de consumo, la persona compradora dispone de 14 días naturales para desistir, siempre que el servicio no se haya ejecutado completamente.</p>
            <p>Si solicita expresamente que el servicio comience dentro de ese plazo, acepta su inicio anticipado. Si desiste después de que haya comenzado pero antes de su ejecución completa, podrá corresponder el abono proporcional de la parte ya prestada. Una vez prestado íntegramente, el derecho se extingue conforme a la normativa aplicable. Los derechos imperativos de consumidores y usuarios prevalecen.</p>
          </LegalSection>

          <LegalSection title="8. Alcance y resultados">
            <p>Los servicios ofrecen orientación y trabajo práctico adaptado a la información facilitada. No garantizan resultados económicos, un ahorro concreto, una automatización completa ni la compatibilidad permanente de servicios de terceros.</p>
            <p>Las decisiones empresariales, creativas, legales o técnicas posteriores corresponden a la persona contratante.</p>
          </LegalSection>

          <LegalSection title="9. Propiedad y confidencialidad">
            <p>Los sistemas, configuraciones y documentos construidos específicamente para el cliente pueden seguir utilizándose en su actividad profesional después de cancelar la suscripción.</p>
            <p>Las plantillas base, métodos o instrucciones generales entregados pueden utilizarse en la actividad profesional de la persona contratante, pero no revenderse ni distribuirse como producto propio.</p>
            <p>Alberto tratará como confidencial la información empresarial compartida para preparar y prestar el servicio, excepto cuando exista obligación legal o autorización expresa para utilizar el caso.</p>
          </LegalSection>

          <LegalSection title="10. Datos y legislación">
            <p>Los datos se tratan conforme a la <Link href="/privacidad">política de privacidad</Link>. Para cualquier incidencia se recomienda contactar primero por email.</p>
            <p>Estas condiciones se rigen por la legislación española, sin perjuicio de los fueros y derechos imperativos que correspondan a consumidores y usuarios.</p>
          </LegalSection>
        </div>
        <p className="mt-16 border-t border-[#f2eee5]/20 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2eee5]/32">Última actualización: 29 de julio de 2026 · pendiente de revisión legal.</p>
      </article>
    </PageLayout>
  );
}

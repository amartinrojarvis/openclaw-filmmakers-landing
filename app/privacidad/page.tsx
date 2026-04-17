import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Politica de Privacidad | OpenClaw para Filmmakers",
  description: "Informacion sobre como recopilamos, usamos y protegemos tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-8">
          Politica de <span className="text-[#00ff88]">Privacidad</span>
        </h1>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">1. Responsable del tratamiento</h2>
            <p className="mb-4">
              El responsable del tratamiento de tus datos personales es:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li><strong>Nombre:</strong> Alberto Martin</li>
              <li><strong>Correo electronico:</strong> alberto@tuvideopromocional.es</li>
              <li><strong>Sitio web:</strong> https://www.iaparafilmmakers.es</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">2. Datos que recopilamos</h2>
            <p className="mb-4">
              Recopilamos los siguientes datos personales a traves de nuestro sitio web:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li><strong>Email y nombre:</strong> cuando te suscribes a nuestros formularios de contacto o lead magnet.</li>
              <li><strong>Datos de navegacion:</strong> paginas visitadas, tiempo de sesion, origen del trafico (a traves de Google Analytics, si das tu consentimiento).</li>
              <li><strong>Datos de compra:</strong> gestionados exclusivamente por Stripe para procesar pagos. No almacenamos datos bancarios en nuestros servidores.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">3. Finalidad del tratamiento</h2>
            <p className="mb-4">
              Utilizamos tus datos para las siguientes finalidades:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li><strong>Gestion de suscriptores:</strong> enviarte el lead magnet, guias y comunicaciones relacionadas con nuestros servicios.</li>
              <li><strong>Ventas:</strong> procesar tus compras y enviarte el acceso a los productos adquiridos.</li>
              <li><strong>Analisis web:</strong> mejorar la experiencia de usuario y el rendimiento del sitio (solo con tu consentimiento).</li>
              <li><strong>Marketing:</strong> mostrarte publicidad relevante (solo con tu consentimiento explicito).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">4. Base juridica</h2>
            <p className="mb-4">
              La base juridica para el tratamiento de tus datos es:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li><strong>Ejecucion de contrato:</strong> para procesar compras y entregas de productos.</li>
              <li><strong>Consentimiento:</strong> para el envio de comunicaciones comerciales, cookies de analiticas y marketing.</li>
              <li><strong>Interes legitimo:</strong> para responder a consultas y garantizar la seguridad del sitio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">5. Con quien compartimos tus datos</h2>
            <p className="mb-4">
              No vendemos tus datos personales. Solo compartimos la informacion estrictamente necesaria con los siguientes proveedores de confianza:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li><strong>Stripe:</strong> procesamiento de pagos.</li>
              <li><strong>Brevo:</strong> gestion de suscriptores y envio de emails.</li>
              <li><strong>Google Analytics:</strong> analisis de trafico web (solo si aceptas cookies de estadisticas).</li>
              <li><strong>Meta (Facebook/Instagram):</strong> publicidad y remarketing (solo si aceptas cookies de marketing).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">6. Tus derechos</h2>
            <p className="mb-4">
              De acuerdo con el Reglamento General de Proteccion de Datos (RGPD), tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li>Acceder a tus datos personales.</li>
              <li>Solicitar la rectificacion de datos inexactos.</li>
              <li>Solicitar la supresion de tus datos (derecho al olvido).</li>
              <li>Limitar el tratamiento de tus datos.</li>
              <li>Oponerte al tratamiento.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
              <li>Retirar tu consentimiento en cualquier momento.</li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, envianos un correo a{" "}
              <a href="mailto:alberto@tuvideopromocional.es" className="text-[#00ff88] hover:underline">
                alberto@tuvideopromocional.es
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">7. Conservacion de datos</h2>
            <p className="mb-4">
              Conservamos tus datos personales durante el tiempo necesario para cumplir con las finalidades descritas:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li><strong>Datos de suscriptores:</strong> hasta que solicites la baja.</li>
              <li><strong>Datos de compras:</strong> durante el tiempo legalmente exigido (minimo 4 anos en Espana).</li>
              <li><strong>Cookies de consentimiento:</strong> 1 ano desde la ultima actualizacion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">8. Seguridad</h2>
            <p className="mb-4">
              Implementamos medidas tecnicas y organizativas apropiadas para proteger tus datos personales contra accesos no autorizados, perdida o alteracion. Entre ellas:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li>Conexion segura mediante HTTPS en todo el sitio web.</li>
              <li>Procesamiento de pagos 100% externalizado a Stripe (PCI DSS compliant).</li>
              <li>Acceso restringido a datos personales.</li>
              <li>Revision periodica de seguridad del sitio web.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">9. Cambios en esta politica</h2>
            <p className="mb-4">
              Nos reservamos el derecho a actualizar esta Politica de Privacidad para adaptarla a cambios legislativos o mejoras en nuestros servicios. Te recomendamos revisarla periodicamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">10. Contacto</h2>
            <p className="mb-4">
              Si tienes cualquier duda sobre esta Politica de Privacidad, puedes contactarnos en:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:alberto@tuvideopromocional.es" className="text-[#00ff88] hover:underline">
                  alberto@tuvideopromocional.es
                </a>
              </li>
            </ul>
          </section>

          <div className="pt-8 text-sm text-white/40">
            <p>
              Para mas informacion sobre cookies, consulta nuestra{" "}
              <Link href="/cookies" className="text-[#00ff88] hover:underline">
                Politica de Cookies
              </Link>.
            </p>
            <p className="mt-2">Ultima actualizacion: Abril 2026</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

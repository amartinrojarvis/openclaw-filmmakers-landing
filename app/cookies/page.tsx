import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { OpenCookieSettings } from "@/components/OpenCookieSettings";

export const metadata: Metadata = {
  title: "Politica de Cookies | OpenClaw para Filmmakers",
  description: "Informacion detallada sobre el uso de cookies y gestion de consentimiento en nuestro sitio web.",
};

export default function CookiesPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-8">
          Politica de <span className="text-[#00ff88]">Cookies</span>
        </h1>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">¿Que son las cookies?</h2>
            <p className="mb-4">
              Las cookies son pequenos archivos de texto que los sitios web colocan en tu dispositivo 
              para almacenar informacion sobre tu navegacion. En cumplimiento con el Reglamento General 
              de Proteccion de Datos (GDPR) y la Ley de Servicios de la Sociedad de la Informacion (LSSI), 
              te informamos detalladamente sobre las cookies que utilizamos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Gestion de consentimiento</h2>
            <p className="mb-4">
              Al visitar nuestra web, se te presenta un banner para que puedas decidir que cookies 
              aceptas. Tus preferencias se almacenan localmente en tu navegador y puedes modificarlas 
              en cualquier momento:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-2 mb-4">
              <li>Aceptar todas las cookies</li>
              <li>Rechazar cookies no esenciales</li>
              <li>Personalizar tus preferencias por categoria</li>
              <li>Modificar tu consentimiento cuando quieras</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Categorias de cookies</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
                  Cookies necesarias (Siempre activas)
                </h3>
                <p className="mb-2 text-white/60">
                  Esenciales para el funcionamiento basico del sitio. No almacenan informacion personal identificable.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1 text-sm">
                  <li>Sesion de navegacion y seguridad</li>
                  <li>Preferencias de visualizacion (tema, idioma)</li>
                  <li>Procesamiento de pagos seguros (Stripe)</li>
                  <li>Cookie de consentimiento propia</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#aa00ff]"></span>
                  Cookies de estadisticas
                </h3>
                <p className="mb-2 text-white/60">
                  Nos ayudan a entender como interactuas con el sitio. Son anonimas y no identifican personalmente.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1 text-sm">
                  <li>Google Analytics (Google LLC): paginas vistas, tiempo de navegacion</li>
                  <li>Google Tag Manager (Google LLC): gestion de etiquetas</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Cookies de marketing
                </h3>
                <p className="mb-2 text-white/60">
                  Utilizadas para mostrarte anuncios relevantes y medir su efectividad. Requieren tu consentimiento explicito.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1 text-sm">
                  <li>Meta Pixel (Meta Platforms, Inc.): conversion y remarketing</li>
                  <li>YouTube (Google LLC): reproduccion de videos incrustados y personalizacion de anuncios</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Cookies especificas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-white/50 border-b border-white/10">
                  <tr>
                    <th className="py-3">Cookie / Entidad</th>
                    <th className="py-3">Duracion</th>
                    <th className="py-3">Tipo</th>
                    <th className="py-3">Proposito</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-3">cookie_consent_v1<br/><span className="text-white/40 text-xs">Propia</span></td>
                    <td className="py-3">1 año</td>
                    <td className="py-3">Necesaria</td>
                    <td className="py-3">Almacena tus preferencias de consentimiento</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">__stripe_mid<br/><span className="text-white/40 text-xs">Stripe, Inc.</span></td>
                    <td className="py-3">1 año</td>
                    <td className="py-3">Necesaria</td>
                    <td className="py-3">Prevencion de fraude en pagos</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">_ga<br/><span className="text-white/40 text-xs">Google LLC</span></td>
                    <td className="py-3">2 años</td>
                    <td className="py-3">Estadisticas</td>
                    <td className="py-3">Distingue usuarios unicos en Google Analytics</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">_gid<br/><span className="text-white/40 text-xs">Google LLC</span></td>
                    <td className="py-3">24 horas</td>
                    <td className="py-3">Estadisticas</td>
                    <td className="py-3">Distingue usuarios durante la sesion</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">_gat / _gat_gtag_UA_*<br/><span className="text-white/40 text-xs">Google LLC</span></td>
                    <td className="py-3">1 minuto</td>
                    <td className="py-3">Estadisticas</td>
                    <td className="py-3">Limita la tasa de solicitudes a Analytics</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">_fbp<br/><span className="text-white/40 text-xs">Meta Platforms, Inc.</span></td>
                    <td className="py-3">3 meses</td>
                    <td className="py-3">Marketing</td>
                    <td className="py-3">Identifica navegadores para publicidad y remarketing</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">VISITOR_INFO1_LIVE<br/><span className="text-white/40 text-xs">Google LLC (YouTube)</span></td>
                    <td className="py-3">6 meses</td>
                    <td className="py-3">Marketing</td>
                    <td className="py-3">Estima el ancho de banda y personaliza recomendaciones</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">YSC<br/><span className="text-white/40 text-xs">Google LLC (YouTube)</span></td>
                    <td className="py-3">Sesion</td>
                    <td className="py-3">Marketing</td>
                    <td className="py-3">Registra un ID unico para estadisticas del video</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">CONSENT<br/><span className="text-white/40 text-xs">Google LLC (YouTube)</span></td>
                    <td className="py-3">2 años</td>
                    <td className="py-3">Marketing</td>
                    <td className="py-3">Almacena las preferencias de consentimiento de Google</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Transferencias internacionales de datos</h2>
            <p className="mb-4">
              Algunos de los terceros mencionados anteriormente operan desde fuera del Espacio Economico Europeo (EEE), concretamente en Estados Unidos. Esto implica una transferencia internacional de datos:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-2 mb-4">
              <li><strong>Google LLC</strong> y <strong>Meta Platforms, Inc.</strong> estan certificados bajo el <em>EU-U.S. Data Privacy Framework</em>, que la Comision Europea reconoce como garantia adecuada para estas transferencias.</li>
              <li>Ademas, solo transferimos datos cuando has otorgado tu consentimiento explicito para las cookies de estadisticas y/o marketing.</li>
              <li>Puedes revocar tu consentimiento en cualquier momento, lo que detendra cualquier futura transferencia asociada a dichas cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Prueba de consentimiento</h2>
            <p className="mb-4">
              Cada vez que das, modificas o rechazas tu consentimiento de cookies, registramos de forma segura un log con la fecha, hora, categoria aceptadas/rechazadas y una huella anonimizada de tu conexion. Este registro nos permite demostrar ante las autoridades de proteccion de datos que tu consentimiento fue libre, especifico, informado y inequivoco.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Modificar tu consentimiento</h2>
            <p className="mb-4">
              Puedes cambiar tus preferencias de cookies en cualquier momento haciendo clic en el 
              enlace "Gestionar cookies" del pie de pagina, o accediendo directamente a:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <OpenCookieSettings />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Mas informacion</h2>
            <p className="mb-4">
              Para mas detalles sobre como procesamos tus datos personales, consulta nuestra{" "}
              <Link href="/privacidad" className="text-[#00ff88] hover:underline">
                Politica de Privacidad
              </Link>.
            </p>
            <p>
              Si tienes preguntas sobre nuestra politica de cookies, puedes contactarnos en:{" "}
              <a 
                href="mailto:alberto@tuvideopromocional.es" 
                className="text-[#00ff88] hover:underline"
              >
                alberto@tuvideopromocional.es
              </a>
            </p>
          </section>

          <div className="pt-8 text-sm text-white/40">
            Ultima actualizacion: Abril 2026
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

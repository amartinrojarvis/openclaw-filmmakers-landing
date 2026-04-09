import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Política de Cookies | OpenClaw para Filmmakers",
  description: "Información detallada sobre el uso de cookies y gestión de consentimiento en nuestro sitio web.",
};

export default function CookiesPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-8">
          Política de <span className="text-[#00ff88]">Cookies</span>
        </h1>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">¿Qué son las cookies?</h2>
            <p className="mb-4">
              Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo 
              para almacenar información sobre tu navegación. En cumplimiento con el Reglamento General 
              de Protección de Datos (GDPR) y la Ley de Servicios de la Sociedad de la Información (LSSI), 
              te informamos detalladamente sobre las cookies que utilizamos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Gestor de consentimiento</h2>
            <p className="mb-4">
              Utilizamos <strong>Usercentrics Cookiebot CMP</strong> para gestionar tus preferencias de cookies 
              de forma transparente y conforme a la normativa europea. Al visitar nuestra web, se te presentará 
              un banner para que puedas:
            </p>
            <ul className="list-disc list-inside text-white/50 space-y-2 mb-4">
              <li>Aceptar todas las cookies</li>
              <li>Rechazar cookies no esenciales</li>
              <li>Personalizar tus preferencias por categoría</li>
              <li>Modificar tu consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Categorías de cookies</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
                  Cookies necesarias (Siempre activas)
                </h3>
                <p className="mb-2 text-white/60">
                  Esenciales para el funcionamiento básico del sitio. No almacenan información personal identificable.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1 text-sm">
                  <li>Sesión de navegación y seguridad</li>
                  <li>Preferencias de visualización (tema, idioma)</li>
                  <li>Procesamiento de pagos seguros (Stripe)</li>
                  <li>Cookie de consentimiento (Cookiebot)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#aa00ff]"></span>
                  Cookies de estadísticas
                </h3>
                <p className="mb-2 text-white/60">
                  Nos ayudan a entender cómo interactúas con el sitio. Son anónimas y no identifican personalmente.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1 text-sm">
                  <li>Google Analytics: páginas vistas, tiempo de navegación</li>
                  <li>Google Tag Manager: gestión de etiquetas</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan"></span>
                  Cookies de marketing
                </h3>
                <p className="mb-2 text-white/60">
                  Utilizadas para mostrarte anuncios relevantes y medir su efectividad. Requieren tu consentimiento explícito.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1 text-sm">
                  <li>Meta Pixel (Facebook/Instagram): conversión y remarketing</li>
                  <li>YouTube: reproducción de videos incrustados</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Cookies específicas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-white/50 border-b border-white/10">
                  <tr>
                    <th className="py-3">Cookie</th>
                    <th className="py-3">Duración</th>
                    <th className="py-3">Tipo</th>
                    <th className="py-3">Propósito</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-3">UsercentricsConsentHistory</td>
                    <td className="py-3">1 año</td>
                    <td className="py-3">Necesaria</td>
                    <td className="py-3">Almacena tu historial de consentimiento</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">_ga (Google)</td>
                    <td className="py-3">2 años</td>
                    <td className="py-3">Estadísticas</td>
                    <td className="py-3">Distingue usuarios únicos</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">_fbp (Meta)</td>
                    <td className="py-3">3 meses</td>
                    <td className="py-3">Marketing</td>
                    <td className="py-3">Identifica navegadores para publicidad</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">__stripe_mid</td>
                    <td className="py-3">1 año</td>
                    <td className="py-3">Necesaria</td>
                    <td className="py-3">Prevención de fraude en pagos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Modificar tu consentimiento</h2>
            <p className="mb-4">
              Puedes cambiar tus preferencias de cookies en cualquier momento haciendo clic en el 
              botón "Cambiar consentimiento" que aparece en la parte inferior izquierda de la pantalla, 
              o accediendo directamente a:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <button 
                data-cc="c-settings"
                className="text-[#00ff88] hover:underline cursor-pointer bg-transparent border-none"
              >
                Abrir configuración de cookies →
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Más información</h2>
            <p className="mb-4">
              Para más detalles sobre cómo procesamos tus datos personales, consulta nuestra{" "}
              <Link href="/privacidad" className="text-[#00ff88] hover:underline">
                Política de Privacidad
              </Link>.
            </p>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en:{" "}
              <a 
                href="mailto:alberto@tuvideopromocional.es" 
                className="text-[#00ff88] hover:underline"
              >
                alberto@tuvideopromocional.es
              </a>
            </p>
          </section>

          <div className="pt-8 text-sm text-white/40">
            Última actualización: Abril 2026
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

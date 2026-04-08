import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Política de Cookies | OpenClaw para Filmmakers",
  description: "Información sobre el uso de cookies en nuestro sitio web.",
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
            <p>
              Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo 
              para almacenar información sobre tu navegación. Esta web utiliza cookies mínimas y 
              esenciales para su funcionamiento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Cookies que utilizamos</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2">Cookies técnicas esenciales</h3>
                <p className="mb-2">
                  Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
                </p>
                <ul className="list-disc list-inside text-white/50 space-y-1">
                  <li>Sesión de navegación</li>
                  <li>Preferencias de visualización</li>
                  <li>Procesamiento de pagos (Stripe)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2">Cookies de rendimiento</h3>
                <p>
                  Nos ayudan a entender cómo interactúas con el sitio para mejorar la experiencia.
                  Son anónimas.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Gestión de cookies</h2>
            <p>
              Puedes configurar tu navegador para rechazar todas las cookies o para que te avise 
              cuando se envíen cookies. Sin embargo, algunas funcionalidades del sitio pueden no 
              funcionar correctamente si desactivas las cookies esenciales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Más información</h2>
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

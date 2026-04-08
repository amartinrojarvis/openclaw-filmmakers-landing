import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Condiciones de Compra | OpenClaw para Filmmakers",
  description: "Política de devolución y condiciones legales de compra.",
};

export default function CondicionesPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-8">
          Condiciones de <span className="text-[#00ff88]">Compra</span>
        </h1>

        <div className="space-y-12">
          {/* Política de Devolución */}
          <section>
            <h2 className="text-2xl font-medium text-[#00ff88] mb-4">Política de Devolución</h2>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-lg leading-7 text-white/80">
                <strong className="text-white">No se realizarán devoluciones de dinero.</strong>{" "}
                Todos los productos digitales se entregan de forma inmediata y su compra es definitiva.
              </p>
            </div>
          </section>

          {/* Condiciones Legales */}
          <section>
            <h2 className="text-2xl font-medium text-[#00ff88] mb-4">Condiciones Legales</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-sm uppercase tracking-wider text-white/40 mb-2">Responsable</h3>
                  <p className="text-lg font-medium text-white">Alberto Martín</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-sm uppercase tracking-wider text-white/40 mb-2">NIF/CIF</h3>
                  <p className="text-lg font-medium text-white">[Placeholder]</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-sm uppercase tracking-wider text-white/40 mb-2">Dirección</h3>
                  <p className="text-lg font-medium text-white">Salamanca, España</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-sm uppercase tracking-wider text-white/40 mb-2">Contacto</h3>
                  <p className="text-lg font-medium text-white">
                    alberto@tuvideopromocional.es
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-sm uppercase tracking-wider text-white/40 mb-4">Producto</h3>
                <p className="text-lg leading-7 text-white/70">
                  Guía digital descargable sobre automatización de workflow creativo para filmmakers
                  mediante OpenClaw. Incluye documentación técnica, ejemplos de implementación
                  y recursos adicionales en formato digital.
                </p>
              </div>
            </div>
          </section>

          {/* Nota Adicional */}
          <section>
            <h2 className="text-2xl font-medium text-[#00ff88] mb-4">Información Adicional</h2>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="leading-7 text-white/70">
                Al realizar una compra en esta web, aceptas las presentes condiciones. Los
                productos digitales se entregan mediante enlace de descarga inmediatamente
                después del pago. Para cualquier consulta o incidencia con tu compra,
                contacta directamente a través del correo electrónico proporcionado.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

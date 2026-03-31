import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Condiciones de Compra | OpenClaw para Filmmakers",
  description: "Política de devolución y condiciones legales de compra.",
};

export default function CondicionesPage() {
  return (
    <>
      <main className="min-h-screen bg-[#07111f] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 transition hover:text-cyan"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la página principal
          </Link>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">
            Condiciones de Compra
          </h1>

          <div className="mt-12 space-y-12">
            {/* Política de Devolución */}
            <section>
              <h2 className="text-2xl font-semibold text-cyan">Política de Devolución</h2>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-lg leading-7 text-slate-200">
                  <strong className="text-white">No se realizarán devoluciones de dinero.</strong>{" "}
                  Todos los productos digitales se entregan de forma inmediata y su compra es definitiva.
                </p>
              </div>
            </section>

            {/* Condiciones Legales */}
            <section>
              <h2 className="text-2xl font-semibold text-cyan">Condiciones Legales</h2>
              <div className="mt-4 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm uppercase tracking-[0.28em] text-slate-400">Responsable</h3>
                    <p className="mt-2 text-lg font-medium text-white">Alberto Martín</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm uppercase tracking-[0.28em] text-slate-400">NIF/CIF</h3>
                    <p className="mt-2 text-lg font-medium text-white">[Placeholder]</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm uppercase tracking-[0.28em] text-slate-400">Dirección</h3>
                    <p className="mt-2 text-lg font-medium text-white">Salamanca, España</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm uppercase tracking-[0.28em] text-slate-400">Contacto</h3>
                    <p className="mt-2 text-lg font-medium text-white">
                      alberto@tuvideopromocional.es
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-sm uppercase tracking-[0.28em] text-slate-400">Producto</h3>
                  <p className="mt-4 text-lg leading-7 text-slate-200">
                    Guía PDF descargable sobre automatización de workflow creativo para filmmakers
                    mediante OpenClaw. Incluye documentación técnica, ejemplos de implementación
                    y recursos adicionales en formato digital.
                  </p>
                </div>
              </div>
            </section>

            {/* Nota Adicional */}
            <section>
              <h2 className="text-2xl font-semibold text-cyan">Información Adicional</h2>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="leading-7 text-slate-200">
                  Al realizar una compra en esta web, aceptas las presentes condiciones. Los
                  productos digitales se entregan mediante enlace de descarga inmediatamente
                  después del pago. Para cualquier consulta o incidencia con tu compra,
                  contacta directamente a través del correo electrónico proporcionado.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

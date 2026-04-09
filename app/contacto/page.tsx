import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Instagram } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Contacto | OpenClaw para Filmmakers",
  description: "Ponte en contacto con nosotros para cualquier consulta sobre la guía OpenClaw para Filmmakers.",
};

export default function ContactoPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-4">
          Contacto
        </h1>
        <p className="text-xl text-white/60 mb-12">
          Estoy aquí para ayudarte con cualquier duda sobre la guía o la automatización de tu workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}
          <a 
            href="mailto:alberto@tuvideopromocional.es"
            className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00ff88]/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors">
              <Mail className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Email</h3>
            <p className="text-white/50 mb-4">Respuesta en 24-48h</p>
            <p className="text-[#00ff88] group-hover:underline">
              alberto@tuvideopromocional.es
            </p>
          </a>

          {/* Telegram Card */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Telegram</h3>
            <p className="text-white/50 mb-4">Para compradores del bundle</p>
            <p className="text-white/70">
              Acceso prioritario incluido en la sesión 1:1
            </p>
          </div>

          {/* Instagram Card */}
          <a 
            href="https://www.instagram.com/amartinro/"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00ff88]/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors">
              <Instagram className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Instagram</h3>
            <p className="text-white/50 mb-4">Sígueme para más contenido</p>
            <p className="text-[#00ff88] group-hover:underline">
              @amartinro
            </p>
          </a>

          {/* Location Card */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Ubicación</h3>
            <p className="text-white/50 mb-4">Trabajando desde</p>
            <p className="text-white/70">
              Salamanca, España
            </p>
          </div>

        </div>

        {/* FAQ CTA */}
        <div className="p-8 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/20 text-center">
          <h2 className="text-2xl font-medium text-white mb-4">
            ¿Tienes dudas antes de comprar?
          </h2>
          <p className="text-white/60 mb-6">
            Consulta nuestras preguntas frecuentes o envíame un email directamente.
          </p>
          <a 
            href="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Ver precios y FAQ
          </a>
        </div>
      </div>
    </PageLayout>
  );
}

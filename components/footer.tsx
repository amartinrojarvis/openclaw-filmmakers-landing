import { Instagram, Globe, Mail } from 'lucide-react';
import Link from 'next/link';
import { EmailCapture } from './EmailCapture';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07111f] py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://instagram.com/amartinro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 transition hover:text-cyan"
                >
                  <Instagram className="h-4 w-4" />
                  @amartinro
                </a>
              </li>
              <li>
                <a
                  href="https://tufotoyvideopromocional.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 transition hover:text-cyan"
                >
                  <Globe className="h-4 w-4" />
                  tufotoyvideopromocional.es
                </a>
              </li>
              <li>
                <a
                  href="mailto:alberto@tuvideopromocional.es"
                  className="flex items-center gap-2 text-slate-300 transition hover:text-cyan"
                >
                  <Mail className="h-4 w-4" />
                  alberto@tuvideopromocional.es
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/condiciones"
                  className="text-slate-300 transition hover:text-cyan"
                >
                  Condiciones de Compra
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">OpenClaw para Filmmakers</h3>
            <p className="mt-4 text-sm text-slate-400">
              Automatiza tu workflow creativo y recupera horas para lo que realmente importa: crear.
            </p>
          </div>
        </div>

        {/* Email Capture Section - Elegante y sutil */}
        <div className="mt-12 mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                ¿Aún no estás listo para comprar?
              </h3>
              <p className="text-sm text-slate-400">
                Recibe 3 casos de uso explicados GRATIS y descubre cómo funciona antes de invertir.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <EmailCapture variant="footer" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Alberto Martín. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { ArrowLeft, Clapperboard } from 'lucide-react';
import { AnimatedBackground, PulsingGlow, GradientOrbs } from './AnimatedBackground';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  fullHeight?: boolean;
}

export function PageLayout({ children, showBackButton = true, fullHeight = true }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
        <PulsingGlow />
        <GradientOrbs />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        {showBackButton && (
          <nav className="px-6 py-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver</span>
              </Link>
              
              <Link href="/" className="flex items-center gap-2 text-white">
                <Clapperboard className="w-5 h-5 text-[#00ff88]" />
                <span className="font-medium">iaparafilmmakers</span>
              </Link>
            </div>
          </nav>
        )}
        
        {/* Main Content */}
        <main className={fullHeight ? 'min-h-[calc(100vh-200px)]' : ''}>
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-white/5 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                  <Clapperboard className="w-5 h-5 text-[#00ff88]" />
                </div>
                <span className="text-white font-medium">iaparafilmmakers</span>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-white/40">
                <Link href="/condiciones" className="hover:text-white transition-colors">
                  Condiciones de compra
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Política de cookies
                </Link>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </div>
              
              <p className="text-sm text-white/30">
                © 2026 iaparafilmmakers. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

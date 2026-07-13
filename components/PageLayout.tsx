'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from './footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  fullHeight?: boolean;
}

export function PageLayout({ children, showBackButton = true, fullHeight = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#171612] text-[#f2eee5]">
      <header className="border-b border-[#f2eee5]/15">
        <nav className="mx-auto flex min-h-20 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12" aria-label="Navegación secundaria">
          <Link href="/" className="flex items-baseline gap-2" aria-label="IA para Filmmakers, inicio">
            <span className="font-black uppercase tracking-[-0.035em]">IA para Filmmakers</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff5a2a] sm:inline">por Alberto Martín</span>
          </Link>
          {showBackButton && (
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#f2eee5]/65 transition-colors hover:text-[#ff5a2a]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a la sesión
            </Link>
          )}
        </nav>
      </header>
      <main className={fullHeight ? 'min-h-[60vh]' : ''}>{children}</main>
      <Footer />
    </div>
  );
}

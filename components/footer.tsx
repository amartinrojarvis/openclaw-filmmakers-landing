'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { openCookieSettings } from '@/lib/cookies';

export function Footer() {
  return (
    <footer className="border-t border-[#f2eee5]/15 bg-[#171612] px-5 py-12 text-[#f2eee5] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-[1.25fr_.75fr_.75fr]">
        <div>
          <p className="text-lg font-black uppercase tracking-[-0.035em]">IA para Filmmakers</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#f2eee5]/45">Orientación práctica para estudiar tu caso y diseñar herramientas de IA que tengan sentido en tu trabajo audiovisual.</p>
        </div>
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Contacto</p>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm text-[#f2eee5]/58">
            <a href="mailto:alberto@tuvideopromocional.es" className="hover:text-[#ff5a2a]">alberto@tuvideopromocional.es</a>
            <a href="https://instagram.com/amartinro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#ff5a2a]">@amartinro <ArrowUpRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff5a2a]">Legal y privacidad</p>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm text-[#f2eee5]/58">
            <Link href="/contacto" className="hover:text-[#ff5a2a]">Contacto</Link>
            <Link href="/condiciones" className="hover:text-[#ff5a2a]">Condiciones</Link>
            <Link href="/privacidad" className="hover:text-[#ff5a2a]">Privacidad</Link>
            <Link href="/cookies" className="hover:text-[#ff5a2a]">Cookies</Link>
            <button type="button" onClick={openCookieSettings} className="cursor-pointer text-left underline decoration-[#ff5a2a]/60 underline-offset-4 hover:text-[#ff5a2a]">Gestionar cookies</button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[90rem] flex-col gap-2 border-t border-[#f2eee5]/15 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2eee5]/30 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Alberto Martín</span><span>Salamanca · España</span>
      </div>
    </footer>
  );
}

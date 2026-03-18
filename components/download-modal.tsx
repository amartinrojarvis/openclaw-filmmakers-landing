'use client';

import { useState, useEffect } from 'react';
import { X, Download, Sparkles, Lock, FileText } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para permitir que el DOM se renderice antes de la animación
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pdfUrl = '/guia-openclaw-filmmakers.pdf';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card principal */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
          {/* Decorative gradient */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet/20 blur-3xl" />
          
          {/* Header con icono */}
          <div className="relative border-b border-white/10 bg-white/5 p-6 text-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">
              Descargar Guía OpenClaw
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Para Filmmakers
            </p>
          </div>

          {/* Contenido */}
          <div className="relative p-6">
            {/* Badge de gratuito */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Gratuito por tiempo limitado
              </span>
            </div>

            {/* Mensaje sobre pasarela de pago */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                <div>
                  <p className="font-medium text-white">Próximamente pasarela de pago</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    En el futuro esta guía estará disponible mediante pasarela de pago. 
                    Por ahora, puedes descargarla <strong className="text-cyan">completamente gratis</strong> como parte de nuestra versión beta.
                  </p>
                </div>
              </div>
            </div>

            {/* Qué incluye */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-slate-400">La guía incluye:</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  Framework de automatización creativa
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  Casos de uso en agenda, clientes y emails
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  Checklist de implementación rápida
                </li>
              </ul>
            </div>

            {/* Botón de descarga */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-white"
              onClick={() => {
                // Cerrar modal después de un momento
                setTimeout(onClose, 500);
              }}
            >
              <Download className="h-5 w-5" />
              Descargar Guía PDF
            </a>

            <p className="mt-4 text-center text-xs text-slate-500">
              Archivo PDF • Descarga inmediata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

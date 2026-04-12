'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface EmailCaptureProps {
  variant?: 'hero' | 'inline' | 'footer' | 'exit';
  title?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
}

export function EmailCapture({
  variant = 'inline',
  title = '3 Casos de Uso de IA para Filmmakers',
  description = 'Recibe 3 casos de uso explicados GRATIS en tu correo. Ejemplos reales, no teoría.',
  buttonText = 'Quiero los 3 casos',
  successMessage = '¡Perfecto! Revisa tu email (incluido spam) en los próximos minutos.',
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Brevo API integration
      const response = await fetch('/api/brevo/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          listId: 7, // Lista "Filmmakers Interesados - 7 Casos"
          attributes: {
            SOURCE: 'website_capture',
            VARIANT: variant,
            DATE_SUBSCRIBED: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Track conversion
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      } else {
        throw new Error('Error al suscribir');
      }
    } catch (err) {
      setError('Hubo un error. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Exit intent popup
  if (variant === 'exit') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-md w-full p-6 relative">
          <button 
            onClick={() => setIsSuccess(true)} // Close on X
            className="absolute top-4 right-4 text-white/40 hover:text-white"
          >
            ✕
          </button>
          
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¿Te vas sin los casos?</h3>
                <p className="text-white/60 text-sm">{description}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 text-xs text-white/70 space-y-1">
                <p>📧 Caso 1: Presupuestos que se escriben solos</p>
                <p>📧 Caso 2: Análisis de cliente potencial</p>
                <p>📧 Caso 3: Análisis automático de material de vídeo</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff88]/50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    buttonText
                  )}
                </button>
              </form>
              
              {error && (
                <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">¡Perfecto!</h3>
              <p className="text-white/60">{successMessage}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hero variant - compact below buttons
  if (variant === 'hero') {
    return (
      <div className="mt-8 pt-6 border-t border-white/10">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Email para recibir los 3 casos gratis"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#00ff88]/50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Recibir casos'
              )}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#00ff88]">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}
        {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
      </div>
    );
  }

  // Footer variant - minimal
  if (variant === 'footer') {
    return (
      <div className="w-full">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#00ff88]/50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#00ff88] text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'OK'}
            </button>
          </form>
        ) : (
          <p className="text-[#00ff88] text-sm">{successMessage}</p>
        )}
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md">
      {!isSuccess ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-white/60 text-sm">{description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff88]/50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                buttonText
              )}
            </button>
          </form>

          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <CheckCircle className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">¡Listo!</h3>
          <p className="text-white/60">{successMessage}</p>
        </div>
      )}
    </div>
  );
}

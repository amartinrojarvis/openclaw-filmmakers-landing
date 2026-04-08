'use client';

import { useEffect, useRef, useState } from 'react';

// Realistic Aurora Borealis Background
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Aurora bands configuration - more visible and animated
    const bands = [
      { color: '#00ff88', opacity: 0.7, speed: 0.0008, amplitude: 120, yOffset: 0.15 },
      { color: '#00ffaa', opacity: 0.55, speed: 0.001, amplitude: 100, yOffset: 0.25 },
      { color: '#aa00ff', opacity: 0.5, speed: 0.0006, amplitude: 140, yOffset: 0.1 },
      { color: '#00dd99', opacity: 0.6, speed: 0.0009, amplitude: 110, yOffset: 0.2 },
      { color: '#8800ff', opacity: 0.45, speed: 0.0007, amplitude: 130, yOffset: 0.3 },
      { color: '#00cc99', opacity: 0.5, speed: 0.0012, amplitude: 90, yOffset: 0.35 },
    ];

    const animate = () => {
      timeRef.current += 1;
      const time = timeRef.current;

      // Clear with darker night sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.3, '#020308');
      gradient.addColorStop(0.6, '#04060c');
      gradient.addColorStop(1, '#060912');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 71.3) % (canvas.height * 0.7);
        const size = (i % 3) * 0.3 + 0.5;
        const twinkle = Math.sin(time * 0.02 + i) * 0.3 + 0.7;
        ctx.globalAlpha = 0.3 * twinkle;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw aurora bands
      bands.forEach((band, index) => {
        ctx.save();
        
        // Create gradient for the band
        const bandGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bandGradient.addColorStop(0, band.color + '00');
        bandGradient.addColorStop(0.3, band.color + Math.floor(band.opacity * 255).toString(16).padStart(2, '0'));
        bandGradient.addColorStop(0.6, band.color + Math.floor(band.opacity * 200).toString(16).padStart(2, '0'));
        bandGradient.addColorStop(1, band.color + '00');
        
        ctx.fillStyle = bandGradient;
        ctx.filter = 'blur(25px)';
        
        ctx.beginPath();
        const baseY = canvas.height * band.yOffset;
        
        // Draw wave-like aurora band
        for (let x = 0; x <= canvas.width; x += 5) {
          const wave1 = Math.sin(x * 0.003 + time * band.speed + index) * band.amplitude;
          const wave2 = Math.sin(x * 0.007 + time * band.speed * 1.5 + index * 2) * (band.amplitude * 0.5);
          const wave3 = Math.sin(x * 0.001 + time * band.speed * 0.5) * (band.amplitude * 0.3);
          const y = baseY + wave1 + wave2 + wave3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Close the path to fill
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      });

      // Add subtle atmospheric glow at horizon
      const horizonGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      horizonGradient.addColorStop(0, 'rgba(0, 100, 150, 0)');
      horizonGradient.addColorStop(0.5, 'rgba(0, 150, 100, 0.1)');
      horizonGradient.addColorStop(1, 'rgba(0, 200, 150, 0.2)');
      ctx.fillStyle = horizonGradient;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  );
}

// CSS-based aurora for fallback or additional layers
export function AuroraCSS() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Green aurora curtain - more visible */}
      <div 
        className="absolute w-[200%] h-[70%] -left-[50%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,136,0.5) 30%, rgba(0,221,170,0.35) 60%, transparent 100%)',
          filter: 'blur(40px)',
          animation: 'aurora-sway 12s ease-in-out infinite',
          transformOrigin: 'top center',
        }}
      />
      
      {/* Purple aurora curtain - more visible */}
      <div 
        className="absolute w-[200%] h-[60%] -left-[30%] top-[10%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(170,0,255,0.45) 40%, rgba(136,0,255,0.3) 70%, transparent 100%)',
          filter: 'blur(50px)',
          animation: 'aurora-sway-2 15s ease-in-out infinite reverse',
          transformOrigin: 'top center',
        }}
      />
      
      {/* Secondary green wave - more visible */}
      <div 
        className="absolute w-[150%] h-[50%] -right-[25%] top-[20%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,200,150,0.4) 50%, transparent 100%)',
          filter: 'blur(35px)',
          animation: 'aurora-sway-3 10s ease-in-out infinite',
          transformOrigin: 'top right',
        }}
      />
      
      <style jsx>{`
        @keyframes aurora-sway {
          0%, 100% { 
            transform: skewX(-8deg) translateX(-8%);
            opacity: 0.7;
          }
          50% { 
            transform: skewX(8deg) translateX(8%);
            opacity: 1;
          }
        }
        @keyframes aurora-sway-2 {
          0%, 100% { 
            transform: skewX(6deg) translateX(6%);
            opacity: 0.6;
          }
          50% { 
            transform: skewX(-6deg) translateX(-6%);
            opacity: 0.95;
          }
        }
        @keyframes aurora-sway-3 {
          0%, 100% { 
            transform: skewX(-5deg) scaleY(1) translateY(0);
            opacity: 0.5;
          }
          50% { 
            transform: skewX(5deg) scaleY(1.2) translateY(-5%);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}

// Combined background component
export function AnimatedBackground() {
  return (
    <>
      <AuroraBackground />
      <AuroraCSS />
      <HeroBottomFade />
    </>
  );
}

// Smooth gradient transition at bottom of hero - ultra soft
export function HeroBottomFade() {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-[50vh] md:h-[40vh] pointer-events-none z-10"
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.9) 90%, #000000 100%)',
        filter: 'blur(0px)',
      }}
    />
  );
}

// Gradient orbs for other sections - adapted to aurora colors
export function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 70%)',
          top: '10%',
          left: '-10%',
          filter: 'blur(60px)',
          animation: 'float-orb-1 25s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(170,0,255,0.15) 0%, transparent 70%)',
          top: '60%',
          right: '-5%',
          filter: 'blur(80px)',
          animation: 'float-orb-2 30s ease-in-out infinite',
        }}
      />
      
      <style jsx>{`
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 20px) scale(1.05); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// Pulsing glow effect - aurora colors
export function PulsingGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main central glow - green aurora */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, rgba(0,200,150,0.08) 30%, rgba(0,150,100,0.04) 50%, transparent 70%)',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse-glow 15s ease-in-out infinite',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Secondary glow - purple aurora */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(170,0,255,0.12) 0%, rgba(136,0,255,0.06) 40%, transparent 65%)',
          top: '20%',
          right: '5%',
          animation: 'pulse-glow-2 12s ease-in-out infinite reverse',
          filter: 'blur(50px)',
        }}
      />
      
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }
        @keyframes pulse-glow-2 {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

// Star field component - client side only to avoid hydration
export function StarField() {
  const [stars, setStars] = useState<Array<{id: number, left: number, top: number, size: number}>>([]);
  
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 70,
      size: Math.random() * 1.5 + 0.5,
    }));
    setStars(generatedStars);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: 0.4,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

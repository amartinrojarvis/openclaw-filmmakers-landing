'use client';

import { useEffect, useRef, useState } from 'react';

// Realistic Aurora Borealis Background - Ultra smooth
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: show static gradient background
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(170, 0, 255, 0.12) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 60%, rgba(0, 255, 136, 0.08) 0%, transparent 40%),
            linear-gradient(180deg, #000000 0%, #020408 30%, #03060a 60%, #050a15 100%)
          `,
        }}
      />
    );
  }

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

    // Aurora bands configuration - ultra smooth
    const bands = [
      { color: '#00ff88', opacity: 0.4, speed: 0.0003, amplitude: 180, yOffset: 0.2 },
      { color: '#00ffaa', opacity: 0.3, speed: 0.0004, amplitude: 150, yOffset: 0.35 },
      { color: '#aa00ff', opacity: 0.35, speed: 0.00025, amplitude: 200, yOffset: 0.15 },
      { color: '#00dd99', opacity: 0.25, speed: 0.00035, amplitude: 160, yOffset: 0.3 },
      { color: '#8800ff', opacity: 0.3, speed: 0.00028, amplitude: 190, yOffset: 0.25 },
      { color: '#00cc99', opacity: 0.2, speed: 0.00045, amplitude: 140, yOffset: 0.4 },
    ];

    const animate = () => {
      timeRef.current += 1;
      const time = timeRef.current;

      // Ultra smooth night sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.2, '#020408');
      gradient.addColorStop(0.5, '#03060a');
      gradient.addColorStop(0.8, '#040810');
      gradient.addColorStop(1, '#050a15');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 80; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 71.3) % (canvas.height * 0.6);
        const size = (i % 3) * 0.25 + 0.3;
        const twinkle = Math.sin(time * 0.015 + i) * 0.2 + 0.8;
        ctx.globalAlpha = 0.2 * twinkle;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw aurora bands with ultra blur
      bands.forEach((band, index) => {
        ctx.save();
        
        // Create smooth gradient for the band
        const bandGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bandGradient.addColorStop(0, band.color + '00');
        bandGradient.addColorStop(0.2, band.color + Math.floor(band.opacity * 200).toString(16).padStart(2, '0'));
        bandGradient.addColorStop(0.5, band.color + Math.floor(band.opacity * 150).toString(16).padStart(2, '0'));
        bandGradient.addColorStop(0.8, band.color + Math.floor(band.opacity * 80).toString(16).padStart(2, '0'));
        bandGradient.addColorStop(1, band.color + '00');
        
        ctx.fillStyle = bandGradient;
        ctx.filter = 'blur(60px)';
        
        ctx.beginPath();
        const baseY = canvas.height * band.yOffset;
        
        // Draw ultra smooth wave-like aurora
        for (let x = 0; x <= canvas.width; x += 3) {
          const wave1 = Math.sin(x * 0.002 + time * band.speed + index) * band.amplitude;
          const wave2 = Math.sin(x * 0.005 + time * band.speed * 1.3 + index * 1.5) * (band.amplitude * 0.4);
          const wave3 = Math.sin(x * 0.001 + time * band.speed * 0.7) * (band.amplitude * 0.2);
          const y = baseY + wave1 + wave2 + wave3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      });

      // Ultra soft atmospheric glow at horizon
      const horizonGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
      horizonGradient.addColorStop(0, 'rgba(0, 255, 136, 0)');
      horizonGradient.addColorStop(0.5, 'rgba(0, 200, 150, 0.05)');
      horizonGradient.addColorStop(0.8, 'rgba(0, 150, 200, 0.08)');
      horizonGradient.addColorStop(1, 'rgba(100, 0, 200, 0.1)');
      ctx.fillStyle = horizonGradient;
      ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);

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

// CSS-based aurora layers for additional depth
export function AuroraCSS() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary green aurora - ultra soft */}
      <div 
        className="absolute w-[250%] h-[80%] -left-[75%] -top-[10%]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.15) 0%, rgba(0,200,150,0.08) 30%, rgba(0,150,100,0.03) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-1 25s ease-in-out infinite',
        }}
      />
      
      {/* Secondary purple aurora - ultra soft */}
      <div 
        className="absolute w-[200%] h-[70%] -left-[50%] top-[5%]"
        style={{
          background: 'radial-gradient(ellipse at 40% 20%, rgba(170,0,255,0.12) 0%, rgba(136,0,255,0.06) 25%, rgba(100,0,200,0.02) 50%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-drift-2 30s ease-in-out infinite reverse',
        }}
      />
      
      {/* Tertiary green wave - background */}
      <div 
        className="absolute w-[180%] h-[60%] -right-[40%] top-[15%]"
        style={{
          background: 'radial-gradient(ellipse at 60% 30%, rgba(0,200,150,0.1) 0%, rgba(0,150,120,0.04) 40%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'aurora-drift-3 20s ease-in-out infinite',
        }}
      />

      {/* Bottom purple haze */}
      <div 
        className="absolute w-full h-[40%] bottom-0 left-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(136,0,255,0.08) 0%, rgba(100,0,200,0.03) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      <style jsx>{`
        @keyframes aurora-drift-1 {
          0%, 100% { 
            transform: translateX(-5%) translateY(0) rotate(-2deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateX(5%) translateY(-3%) rotate(2deg);
            opacity: 1;
          }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { 
            transform: translateX(3%) translateY(0) rotate(1deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateX(-3%) translateY(2%) rotate(-1deg);
            opacity: 0.9;
          }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { 
            transform: translateX(-2%) scaleY(1);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(2%) scaleY(1.1);
            opacity: 0.8;
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

// Ultra smooth gradient transition at bottom of hero
export function HeroBottomFade() {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-[60vh] pointer-events-none z-10"
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.85) 95%, #000000 100%)',
      }}
    />
  );
}

// Gradient orbs for other sections - adapted to aurora colors
export function GradientOrbs() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: static orbs without animation
  if (isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
            top: '5%',
            left: '-10%',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute w-[250px] h-[250px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(170,0,255,0.12) 0%, transparent 70%)',
            top: '50%',
            right: '-5%',
            filter: 'blur(80px)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
          top: '5%',
          left: '-15%',
          filter: 'blur(80px)',
          animation: 'float-orb-1 30s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(170,0,255,0.12) 0%, transparent 70%)',
          top: '50%',
          right: '-10%',
          filter: 'blur(100px)',
          animation: 'float-orb-2 35s ease-in-out infinite',
        }}
      />
      
      <style jsx>{`
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.05); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// Pulsing glow effect - aurora colors
export function PulsingGlow() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: static glows without animation
  if (isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main central glow - green aurora */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, rgba(0,200,150,0.06) 30%, rgba(0,150,100,0.02) 50%, transparent 70%)',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse-glow 20s ease-in-out infinite',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Secondary glow - purple aurora */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(170,0,255,0.1) 0%, rgba(136,0,255,0.04) 40%, transparent 65%)',
          top: '10%',
          right: '0%',
          animation: 'pulse-glow-2 18s ease-in-out infinite reverse',
          filter: 'blur(70px)',
        }}
      />
      
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        @keyframes pulse-glow-2 {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}

// Star field component - client side only to avoid hydration
export function StarField() {
  const [stars, setStars] = useState<Array<{id: number, left: number, top: number, size: number}>>([]);
  const [starCount, setStarCount] = useState(50);
  
  useEffect(() => {
    // Reduce stars on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 15 : 50;
    setStarCount(count);
    
    const generatedStars = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60,
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
            opacity: 0.3,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

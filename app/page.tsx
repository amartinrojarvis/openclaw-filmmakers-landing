'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  Mail,
  MessageSquareText,
  Sparkles,
  Video,
  ChevronDown,
  Zap,
  Clock,
  Star,
  Film,
  Camera,
  Wand2,
  Brain,
  Layers,
  Gauge,
  Palette,
  Workflow,
  Loader2,
} from 'lucide-react';
import { useScrollAnimation, useScrollAnimationGroup } from '@/hooks/useScrollAnimation';
import { useCheckout } from '@/hooks/useCheckout';
import { PageLayout } from '@/components/PageLayout';
import { GradientOrbs } from '@/components/AnimatedBackground';

const PRICE_IDS = {
  guia: 'price_1TJtMYHBqq0IP9Ia8lI2iME2',
  bundle: 'price_1TJtMrHBqq0IP9IaH2MHxqtv',
};

// Componente animado genérico
function AnimatedSection({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  animation?: 'fade-up' | 'slide-left' | 'slide-right' | 'scale-in';
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${animation} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const benefits = [
  {
    icon: CalendarClock,
    title: 'Agenda bajo control',
    text: 'Automatiza reuniones, seguimientos y recordatorios sin perseguir cada detalle a mano.',
  },
  {
    icon: Mail,
    title: 'Emails y propuestas más rápidas',
    text: 'Responde leads, prepara presupuestos y ahorra horas en comunicación repetitiva.',
  },
  {
    icon: MessageSquareText,
    title: 'Clientes mejor atendidos',
    text: 'Crea workflows claros para onboarding, feedback y postproducción.',
  },
  {
    icon: Video,
    title: 'Análisis de vídeo con IA',
    text: 'Extrae insights, estructura material y acelera decisiones creativas y operativas.',
  },
  {
    icon: Bot,
    title: 'Automatización realista',
    text: 'Sin humo técnico: procesos concretos que puedes aplicar en tu negocio creativo.',
  },
  {
    icon: Clapperboard,
    title: 'Más tiempo para crear',
    text: 'Menos admin, más rodaje, edición y estrategia para cerrar mejores proyectos.',
  },
];

const faqs = [
  {
    q: '¿Necesito conocimientos técnicos para aplicar la guía?',
    a: 'No. Está pensada para filmmakers y creadores que quieren resultados prácticos, con ejemplos y procesos accionables.',
  },
  {
    q: '¿Qué incluye la sesión de 45 minutos del Bundle?',
    a: 'Todo lo incluido en la guía, más una sesión de 45 minutos 1:1 donde resolvemos dudas específicas y te orientamos sobre cómo aplicar OpenClaw en tu flujo de trabajo.',
  },
  {
    q: '¿Esto sirve si trabajo solo o en un estudio pequeño?',
    a: 'Sí. De hecho, es donde más impacto suele tener, porque cada hora recuperada cuenta muchísimo.',
  },
  {
    q: '¿La guía habla solo de teoría o hay implementación?',
    a: 'Incluye enfoque estratégico, ejemplos de uso, código listo para copiar-pegar y una hoja de ruta concreta para empezar desde el primer día.',
  },
];

const offers = [
  {
    name: 'Guía OpenClaw',
    price: '€29',
    originalPrice: '€49',
    discount: 'Ahorras €20',
    badge: 'Precio de lanzamiento',
    priceId: PRICE_IDS.guia,
    description: 'La forma más rápida de empezar a automatizar tu workflow creativo con OpenClaw.',
    features: [
      '8 capítulos en Notion con acceso de por vida',
      'Guía viva: actualizaciones continuas incluidas',
      'Instalación paso a paso en Linux/Mac/WSL',
      'Integraciones: Telegram, IA local, APIs',
      'Casos de uso reales: transcripción, análisis de video',
      'Código y configuraciones listas para usar',
    ],
    cta: 'Comprar ahora',
    featured: false,
  },
  {
    name: 'Guía + Sesión 1:1',
    price: '€127',
    originalPrice: '€197',
    discount: 'Ahorras €70',
    badge: 'Mejor valor',
    priceId: PRICE_IDS.bundle,
    description: 'La guía completa más una sesión personalizada para acelerar tu implementación.',
    features: [
      'Todo lo incluido en la Guía OpenClaw',
      'Guía viva: siempre actualizada',
      'Sesión de 45 minutos 1:1 con Alberto',
      'Análisis de tu workflow específico',
      'Recomendaciones personalizadas',
      'Soporte prioritario por email (30 días)',
    ],
    cta: 'Obtener Bundle',
    featured: true,
  },
];

// Feature highlights with icons
const features = [
  { icon: Film, label: 'Análisis de video con IA' },
  { icon: Wand2, label: 'Automatización inteligente' },
  { icon: Brain, label: 'Workflows con IA local' },
  { icon: Layers, label: 'Integración multiplataforma' },
  { icon: Gauge, label: 'Ahorra 10+ horas semanales' },
];

function Hero() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
      <div 
        ref={ref}
        className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hover:bg-white/10 transition-colors">
          <Sparkles className="w-4 h-4 text-[#00ff88]" />
          <span className="text-sm text-white/80">La guía que yo quería tener cuando empecé a automatizar mi workflow</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[0.9] mb-6">
          Automatiza tu
          <br />
          <span className="text-[#00ff88]">workflow creativo</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          La guía práctica para filmmakers que quieren usar OpenClaw e IA 
          para recuperar horas de administración y enfocarse en lo que mejor saben hacer: crear.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#pricing"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-white/10"
          >
            Empezar ahora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {features.slice(0, 4).map((feature, index) => (
            <div 
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-white/60"
            >
              <feature.icon className="w-4 h-4 text-[#00ff88]" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
            <span>8 capítulos prácticos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
            <span>Código listo para usar</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
            <span>Acceso de por vida</span>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/30" />
      </div>
    </section>
  );
}

function Benefits() {
  const { containerRef, visibleItems } = useScrollAnimationGroup(benefits.length);

  return (
    <section id="beneficios" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-[#00ff88] text-sm font-medium uppercase tracking-wider">Beneficios</span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
            Menos admin.
            <br />
            <span className="text-white/60">Más creación.</span>
          </h2>
        </AnimatedSection>
        
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              data-animate-item
              data-animate-index={index}
              className={`group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00ff88]/30 transition-all duration-500 hover:-translate-y-1 glow-card ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors group-hover:scale-110 transform duration-300">
                <benefit.icon className="w-6 h-6 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{benefit.title}</h3>
              <p className="text-white/50 leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();
  
  const steps = [
    {
      number: '01',
      title: 'Descarga la guía',
      description: 'Accede inmediatamente al contenido en Notion con todos los capítulos y recursos.',
      icon: Zap,
    },
    {
      number: '02',
      title: 'Instala OpenClaw',
      description: 'Sigue la guía paso a paso para instalar y configurar OpenClaw en tu sistema.',
      icon: Bot,
    },
    {
      number: '03',
      title: 'Automatiza tu workflow',
      description: 'Implementa los flujos de trabajo específicos para tu negocio de video.',
      icon: Clock,
    },
  ];
  
  const { containerRef, visibleItems } = useScrollAnimationGroup(steps.length);
  
  return (
    <section id="contenido" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#00ff88]/5 rounded-full blur-[150px] -translate-y-1/2" />
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <span className="text-[#00ff88] text-sm font-medium uppercase tracking-wider">Cómo funciona</span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
            De la teoría a la
            <br />
            <span className="text-white/60">acción en 3 pasos</span>
          </h2>
        </AnimatedSection>
        
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-animate-item
              data-animate-index={index}
              className={`relative group ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${index * 150}ms` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
              )}
              
              <div className="text-[80px] font-medium text-white/5 leading-none mb-4 group-hover:text-[#00ff88]/10 transition-colors select-none">
                {step.number}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors group-hover:scale-110 transform duration-300">
                <step.icon className="w-6 h-6 text-[#00ff88]" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">{step.title}</h3>
              <p className="text-white/50 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div 
        ref={ref}
        className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="inline-flex items-center gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#00ff88] text-[#00ff88]" />
          ))}
        </div>
        <blockquote className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-tight mb-8">
          &ldquo;Recuperé más de 10 horas semanales de tareas administrativas. Ahora puedo enfocarme en lo que realmente importa: crear mejores historias.&rdquo;
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#00ff88]/30 ring-offset-2 ring-offset-black bg-white/10">
            <Image
              src="/perfil-alberto-v2.jpg"
              alt="Alberto Martín"
              fill
              className="object-cover"
              sizes="64px"
              priority
            />
          </div>
          <div className="text-left">
            <div className="text-white font-medium text-lg">Alberto Martín</div>
            <div className="text-white/50 text-sm">Filmmaker & Creador de iaparafilmmakers</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualFeatures() {
  const { containerRef, visibleItems } = useScrollAnimationGroup(features.length);
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-[#00ff88] text-sm font-medium uppercase tracking-wider">Todo lo que incluye</span>
        </AnimatedSection>
        
        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              data-animate-item
              data-animate-index={index}
              className={`flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00ff88]/20 transition-all duration-300 group ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center mb-4 group-hover:bg-[#00ff88]/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-[#00ff88]" />
              </div>
              <span className="text-sm text-white/70">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { containerRef, visibleItems } = useScrollAnimationGroup(offers.length);
  const { checkout, loading } = useCheckout();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  
  const handleCheckout = (priceId: string) => {
    if (!loading) {
      setActiveButton(priceId);
      checkout({ priceId });
    }
  };
  
  return (
    <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-[#00ff88] text-sm font-medium uppercase tracking-wider">Precios</span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
            Invierte en tu
            <br />
            <span className="text-white/60">productividad</span>
          </h2>
          <p className="mt-6 text-white/50 text-lg max-w-2xl mx-auto">
            Un pago único. Acceso de por vida. Sin suscripciones.
          </p>
        </AnimatedSection>
        
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {offers.map((offer, index) => (
            <div
              key={index}
              data-animate-item
              data-animate-index={index}
              className={`relative rounded-3xl p-8 transition-all duration-700 ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                offer.featured
                  ? 'bg-white text-black ring-2 ring-[#00ff88]/50'
                  : 'bg-white/[0.02] border border-white/10 text-white hover:border-[#00ff88]/30'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Badge de oferta/destacado */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className={`px-4 py-1 text-sm font-medium rounded-full ${
                  offer.featured
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-[#aa00ff] text-white'
                }`}>
                  {offer.badge}
                </span>
              </div>
              
              {/* Badge de ahorro */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  offer.featured
                    ? 'bg-green-100 text-green-800'
                    : 'bg-[#00ff88]/20 text-[#00ff88]'
                }`}>
                  {offer.discount}
                </span>
              </div>
              
              <div className="mb-6 pt-2">
                <h3 className={`text-2xl font-medium mb-2 ${offer.featured ? 'text-black' : 'text-white'}`}>
                  {offer.name}
                </h3>
                <p className={`text-sm ${offer.featured ? 'text-black/60' : 'text-white/50'}`}>
                  {offer.description}
                </p>
              </div>
              
              {/* Precios con tachado */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className={`text-2xl line-through opacity-50 ${
                    offer.featured ? 'text-black/40' : 'text-white/40'
                  }`}>
                    {offer.originalPrice}
                  </span>
                  <span className={`text-5xl font-medium ${offer.featured ? 'text-black' : 'text-white'}`}>
                    {offer.price}
                  </span>
                </div>
                <span className={offer.featured ? 'text-black/50' : 'text-white/50'}>Pago único</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {offer.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${offer.featured ? 'text-[#00ff88]' : 'text-[#00ff88]'}`} />
                    <span className={`text-sm ${offer.featured ? 'text-black/70' : 'text-white/60'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleCheckout(offer.priceId)}
                disabled={loading && activeButton === offer.priceId}
                className={`w-full py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  offer.featured
                    ? 'bg-black text-white hover:bg-black/80'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {loading && activeButton === offer.priceId ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  offer.cta
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { containerRef, visibleItems } = useScrollAnimationGroup(faqs.length);
  
  return (
    <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-[#00ff88] text-sm font-medium uppercase tracking-wider">FAQ</span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
            Preguntas
            <br />
            <span className="text-white/60">frecuentes</span>
          </h2>
        </AnimatedSection>
        
        <div ref={containerRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              data-animate-item
              data-animate-index={index}
              className={`rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-700 hover:border-white/10 ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-lg font-medium text-white pr-8">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-white/60 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Floating CTA Button for Mobile
function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approximately 100vh)
      const heroHeight = window.innerHeight * 0.8;
      setIsVisible(window.scrollY > heroHeight);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <button
      onClick={scrollToPricing}
      className={`fixed bottom-6 right-6 z-50 lg:hidden flex items-center gap-2 px-5 py-3 bg-[#00ff88] text-black rounded-full font-medium text-sm shadow-lg shadow-[#00ff88]/30 transition-all duration-300 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <span>Ver precios</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

export default function Home() {
  return (
    <PageLayout showBackButton={false}>
      <main className="relative">
        <Hero />
        <Benefits />
        <HowItWorks />
        <VisualFeatures />
        <Testimonial />
        <Pricing />
        <FAQ />
        <FloatingCTA />
      </main>
    </PageLayout>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATS, CASOS, getCaso, relatedCasos } from '@/lib/casos-vibe-coding';
import { CopyPrompt } from '../copy-prompt';
import { NewsletterForm } from '../newsletter-form';
import { CasosLogo, ToolBadge } from '../parts';

const BOOKING_HREF = '/#sesion';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASOS.map((caso) => ({ slug: caso.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  const title = caso
    ? `${caso.plano} · ${caso.t} · IA para Filmmakers`
    : 'Caso · IA para Filmmakers';
  const description = caso?.s ?? 'Caso de edición con IA en DaVinci Resolve.';

  return {
    title: { absolute: title },
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    alternates: caso ? { canonical: `/casos-de-uso-vibe-coding/${caso.id}` } : undefined,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function CasoPage({ params }: Props) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  const related = relatedCasos(caso);

  return (
    <div className="frame caso">
      <header>
        <CasosLogo />
        <Link className="all" href="/casos-de-uso-vibe-coding">Los {CASOS.length} casos</Link>
      </header>
      <div className="wrap">
        <div className="crumb">
          <span className="plano" id="pl">{caso.plano}</span>
          <span className="lbl ln" id="cat">{CATS[caso.c]}</span>
        </div>
        <h1 id="t">{caso.t}</h1>
        <p className="sum" id="s">{caso.s}</p>
        <div className="with">
          Hecho con <span id="tools">{caso.tools.map((tool) => <span className="pill" key={tool}><ToolBadge tool={tool} />{tool}</span>)}</span>
        </div>
        <hr />
        <div className="s">
          <span className="lbl ln">Qué hice</span>
          <p>{caso.hizo}</p>
        </div>
        <div className="s">
          <span className="lbl ln">Resultado esperado</span>
          <p>{caso.esperado}</p>
        </div>
        <div className="s">
          <span className="lbl ln">Lo que conviene saber</span>
          <p>{caso.saber}</p>
        </div>
        <div className="try">
          <div className="h">
            <span><b className="st try-title">Pruébalo tú</b> con ChatGPT (Codex) y Resolve</span>
            <CopyPrompt text={caso.p} />
          </div>
          <pre id="p">{caso.p}</pre>
          <p className="help">
            Cambia lo que va entre corchetes por los datos de tu proyecto. ¿Lo quieres funcionando en tu productora?{' '}
            <a href={BOOKING_HREF}>Llamada de 15 min ↗</a> · Plan de implementación, 199 €/mes.
          </p>
        </div>
        <div className="more">
          <h2><span className="st">Casos relacionados</span></h2>
          <div id="more">
            {related.map((item) => (
              <Link key={item.id} href={`/casos-de-uso-vibe-coding/${item.id}`}>
                <span className="plano">{item.plano}</span>
                {item.t}
              </Link>
            ))}
          </div>
        </div>
        <NewsletterForm />
      </div>
    </div>
  );
}

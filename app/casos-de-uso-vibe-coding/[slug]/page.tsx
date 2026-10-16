import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATS, CASOS, getCaso, relatedCasos } from '@/lib/casos-vibe-coding';
import { getCasoSeo } from '@/lib/casos-seo';
import { CopyPrompt } from '../copy-prompt';
import { NewsletterForm } from '../newsletter-form';
import { CasosLogo, ToolBadge } from '../parts';
import { SaveCasoControl } from '../save-caso';

const BOOKING_HREF = '/#sesion';
const SITE = 'https://www.iaparafilmmakers.es';
const SHARE_IMAGE = '/social-preview-asesoria-v3.png';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASOS.map((caso) => ({ slug: caso.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  const seo = caso ? getCasoSeo(caso.id) : undefined;
  const title = seo
    ? seo.title
    : caso
      ? `${caso.plano} · ${caso.t} · IA para Filmmakers`
      : 'Caso · IA para Filmmakers';
  const description = seo?.description ?? caso?.s ?? 'Caso de edición con IA en DaVinci Resolve.';
  const path = caso ? `/casos-de-uso-vibe-coding/${caso.id}` : undefined;
  const indexable = Boolean(seo);
  const images = [{ url: SHARE_IMAGE, width: 1200, height: 630, alt: caso ? `${caso.t} · IA para Filmmakers` : 'IA para Filmmakers' }];

  return {
    title: { absolute: title },
    description,
    keywords: seo?.keywords,
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      type: 'article',
      locale: 'es_ES',
      siteName: 'IA para Filmmakers',
      url: path,
      title,
      description,
      images,
      ...(seo ? { publishedTime: seo.published, authors: ['Alberto Martín'] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE] },
  };
}

export default async function CasoPage({ params }: Props) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  const related = relatedCasos(caso);
  const seo = getCasoSeo(caso.id);
  const url = `${SITE}/casos-de-uso-vibe-coding/${caso.id}`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'IA para Filmmakers', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Casos de vibe editing', item: `${SITE}/casos-de-uso-vibe-coding` },
      { '@type': 'ListItem', position: 3, name: caso.t, item: url },
    ],
  };
  const author = { '@type': 'Person', name: 'Alberto Martín', url: SITE, jobTitle: 'Filmmaker e ingeniero informático' };
  const jsonLd: object[] = [breadcrumb];
  if (seo) {
    jsonLd.push(
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: seo.title,
        description: seo.description,
        inLanguage: 'es-ES',
        url,
        mainEntityOfPage: url,
        image: `${SITE}${SHARE_IMAGE}`,
        datePublished: seo.published,
        dateModified: seo.published,
        author,
        publisher: { '@type': 'Organization', name: 'IA para Filmmakers', url: SITE },
        keywords: seo.keywords.join(', '),
        about: [{ '@type': 'SoftwareApplication', name: 'FilmCraft', applicationCategory: 'MultimediaApplication', url: 'https://github.com/storytold/filmcraft' }],
        isBasedOn: seo.docs[0].href,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: caso.t,
        description: caso.s,
        inLanguage: 'es-ES',
        url,
        supply: seo.requisitos.map((name) => ({ '@type': 'HowToSupply', name })),
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Revisa los requisitos', text: seo.requisitos.join(' '), url: `${url}#requisitos` },
          { '@type': 'HowToStep', position: 2, name: 'Copia el prompt', text: 'Copia el prompt completo de esta página.', url: `${url}#prompt` },
          { '@type': 'HowToStep', position: 3, name: 'Pégalo en Codex', text: 'Abre Codex en el ordenador donde está FilmCraft y pega el prompt. Codex hace las comprobaciones, la descarga de la CLI si falta y la configuración.', url: `${url}#prompt` },
          { '@type': 'HowToStep', position: 4, name: 'Revisa el resumen', text: seo.queEsperar.join(' '), url: `${url}#que-esperar` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seo.faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
      },
    );
  }

  return (
    <div className="frame caso">
      <header>
        <CasosLogo />
        <Link className="all" href="/casos-de-uso-vibe-coding">Los {CASOS.length} casos</Link>
      </header>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="wrap">
        <nav className="lbl" aria-label="Migas de pan" style={{ marginBottom: 12 }}>
          <Link href="/">IA para Filmmakers</Link> / <Link href="/casos-de-uso-vibe-coding">Casos de vibe editing</Link>
        </nav>
        <div className="crumb">
          <span className="plano" id="pl">{caso.plano}</span>
          <span className="lbl ln" id="cat">{CATS[caso.c]}</span>
          <SaveCasoControl id={caso.id} />
        </div>
        <h1 id="t">{caso.t}</h1>
        <p className="sum" id="s">{caso.s}</p>
        <div className="with">
          Hecho con <span id="tools">{caso.tools.map((tool) => <span className="pill" key={tool}><ToolBadge tool={tool} />{tool}</span>)}</span>
        </div>
        {seo && <p className="sum">{seo.intro}</p>}
        <hr />
        {seo && (
          <>
            <section className="s" id="para-que-sirve">
              <h2 className="lbl ln">Para qué sirve</h2>
              <ul>{seo.paraQue.map((t) => <li key={t}><p>{t}</p></li>)}</ul>
            </section>
            <section className="s" id="requisitos">
              <h2 className="lbl ln">Requisitos</h2>
              <ul>{seo.requisitos.map((t) => <li key={t}><p>{t}</p></li>)}</ul>
            </section>
          </>
        )}
        <div className="s">
          <h2 className="lbl ln">Qué hice</h2>
          <p>{caso.hizo}</p>
        </div>
        <div className="s">
          <h2 className="lbl ln">Resultado esperado</h2>
          <p>{caso.esperado}</p>
        </div>
        <div className="s">
          <h2 className="lbl ln">Lo que conviene saber</h2>
          <p>{caso.saber}</p>
        </div>
        {seo && (
          <section className="s" id="que-esperar">
            <h2 className="lbl ln">Qué esperar al terminar</h2>
            <ul>{seo.queEsperar.map((t) => <li key={t}><p>{t}</p></li>)}</ul>
          </section>
        )}
        <div className="try" id="prompt">
          <div className="h">
            <h2 style={{ font: 'inherit', margin: 0 }}><b className="st try-title">Pruébalo tú</b> con {seo ? 'ChatGPT (Codex) y FilmCraft' : 'ChatGPT (Codex) y Resolve'}</h2>
            <CopyPrompt text={caso.p} />
          </div>
          <pre id="p">{caso.p}</pre>
          <p className="help">
            {seo ? 'Pégalo tal cual en Codex, en el ordenador donde tienes FilmCraft.' : 'Cambia lo que va entre corchetes por los datos de tu proyecto.'} ¿Lo quieres funcionando en tu productora?{' '}
            <a href={BOOKING_HREF}>Llamada de 15 min ↗</a> · Plan de implementación, 199 €/mes.
          </p>
        </div>
        {seo && (
          <>
            <section className="s" id="documentacion">
              <h2 className="lbl ln">Documentación oficial</h2>
              <ul>{seo.docs.map((d) => <li key={d.href}><p><a href={d.href} target="_blank" rel="noopener">{d.label} ↗</a></p></li>)}</ul>
            </section>
            <section className="s" id="preguntas-frecuentes">
              <h2 className="lbl ln">Preguntas frecuentes</h2>
              {seo.faq.map((item) => (
                <details key={item.q}>
                  <summary><h3 style={{ display: 'inline', font: 'inherit' }}>{item.q}</h3></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </section>
          </>
        )}
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

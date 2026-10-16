import type { MetadataRoute } from 'next';
import { CASOS_SEO } from '@/lib/casos-seo';
import { CASOS, CASOS_ACTUALIZADO } from '@/lib/casos-vibe-coding';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.iaparafilmmakers.es';
  return [
    { url: base, lastModified: new Date('2026-07-13'), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/contacto`, lastModified: new Date('2026-07-13'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/condiciones`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookies`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/casos-de-uso-vibe-coding`, lastModified: new Date(CASOS_ACTUALIZADO), changeFrequency: 'weekly', priority: 0.8 },
    ...CASOS.map((caso) => ({
      url: `${base}/casos-de-uso-vibe-coding/${caso.id}`,
      lastModified: new Date(CASOS_SEO[caso.id]?.published ?? CASOS_ACTUALIZADO),
      changeFrequency: 'monthly' as const,
      priority: CASOS_SEO[caso.id] ? 0.7 : 0.6,
    })),
  ];
}

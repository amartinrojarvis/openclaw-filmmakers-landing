import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.iaparafilmmakers.es';
  return [
    { url: base, lastModified: new Date('2026-07-13'), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/contacto`, lastModified: new Date('2026-07-13'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/condiciones`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookies`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
  ];
}

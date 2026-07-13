import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/gracias', '/gracias-asesoria', '/gracias-prompts'],
    },
    sitemap: 'https://www.iaparafilmmakers.es/sitemap.xml',
    host: 'https://www.iaparafilmmakers.es',
  };
}

/** @type {import('next').NextConfig} */
const SITE = "iaparafilmmakers.es";

const nextConfig = {
  async redirects() {
    return [
      {
        // El ápice debe redirigir a www de forma PERMANENTE (301).
        // Sin esto Vercel responde 307 (temporal) y el sinal de indexacion
        // se reparte entre iaparafilmmakers.es y www.iaparafilmmakers.es.
        // El canonical del sitio es www, asi que todo lo demas debe converger ahi.
        source: "/:path*",
        has: [{ type: "host", value: SITE }],
        destination: `https://www.${SITE}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

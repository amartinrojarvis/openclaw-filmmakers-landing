export const ADMIN_PRODUCTION_ORIGIN = 'https://www.iaparafilmmakers.es';
export const ADMIN_TAILSCALE_ORIGIN = 'https://kairos.tailbb2482.ts.net';

function parseOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveTrustedAdminOrigin(
  requestUrl: string,
  originHeader: string | null,
  vercelEnvironment: string | undefined,
): string | null {
  if (!originHeader) return null;
  const candidate = parseOrigin(originHeader);
  if (!candidate) return null;

  let internalOrigin: string | null = null;
  try {
    internalOrigin = new URL(requestUrl).origin;
  } catch {
    return null;
  }

  if (candidate === internalOrigin) return candidate;
  if (candidate === ADMIN_PRODUCTION_ORIGIN || candidate === ADMIN_TAILSCALE_ORIGIN) return candidate;

  if (vercelEnvironment === 'preview') {
    const host = new URL(candidate).hostname;
    if (candidate.startsWith('https://') && host.endsWith('.vercel.app')) return candidate;
  }

  return null;
}

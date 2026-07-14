'use client';

import { usePathname } from 'next/navigation';
import { GoogleTagManagerScript, MetaPixelScript } from '@/components/Analytics';
import { CookieBanner } from '@/components/CookieBanner';

export function PublicTrackingAndConsent() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <>
      <GoogleTagManagerScript />
      <MetaPixelScript />
      <CookieBanner />
    </>
  );
}

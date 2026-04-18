import type { Metadata } from 'next';
import Script from 'next/script';
import { PageLayout } from '@/components/PageLayout';
import { GraciasPromptsContent } from './GraciasPromptsContent';

const META_PIXEL_ID = '4396076083961602';

export const metadata: Metadata = {
  title: 'PDF en camino | IA para Filmmakers',
  description: 'Recibirás el PDF con los 5 prompts de OpenClaw en tu email en breve.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GraciasPromptsPage() {
  return (
    <>
      {/* Meta Pixel - sin gating para tracking de conversión */}
      <Script
        id="meta-pixel-gracias"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <PageLayout showBackButton={true} fullHeight={true}>
        <GraciasPromptsContent />
      </PageLayout>
    </>
  );
}

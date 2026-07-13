import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Asesoría 1:1 de IA para Filmmakers con Alberto Martín';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#050806',
          color: '#fff',
          padding: '72px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: 999, right: -140, top: -180, background: 'rgba(166,118,255,.24)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: 999, left: -180, bottom: -240, background: 'rgba(214,255,75,.18)', filter: 'blur(60px)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 45, height: 45, borderRadius: 13, background: 'rgba(214,255,75,.12)', border: '1px solid rgba(214,255,75,.35)', color: '#d6ff4b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>▶</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>IA <span style={{ color: 'rgba(255,255,255,.42)' }}>para</span> Filmmakers</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 930 }}>
            <div style={{ color: '#d6ff4b', fontSize: 20, letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 26 }}>Sesión práctica 1:1 · 90 minutos</div>
            <div style={{ fontSize: 72, lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 800 }}>
              Aplica IA a un proceso real de tu negocio audiovisual.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20 }}>
            <div style={{ color: 'rgba(255,255,255,.55)' }}>Con Alberto Martín · Filmmaker y creador de productos de IA</div>
            <div style={{ display: 'flex', borderRadius: 999, background: '#d6ff4b', color: '#07100a', padding: '14px 24px', fontWeight: 800 }}>Desde 75 € · precio final</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Generative Workflow | f/2.8 Production Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          position: 'relative',
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Separator */}
        <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.25)', marginBottom: 32 }} />

        {/* Label */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: '0.5em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          f/2.8
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 64,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            textAlign: 'center',
            paddingInline: 40,
          }}
        >
          Generative
          <br />
          Workflow
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            marginTop: 28,
          }}
        >
          Hybrid Visual Production
        </div>

        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 12,
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.15)',
            textTransform: 'uppercase',
          }}
        >
          f/2.8 Production Agency — Istanbul
        </div>
      </div>
    ),
    { ...size }
  );
}

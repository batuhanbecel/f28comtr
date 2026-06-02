import { ImageResponse } from 'next/og';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

interface CreateOgImageOptions {
  alt: string;
  title: string;
  subtitle?: string;
  footer?: string;
}

export function createOgImage({ title, subtitle, footer }: CreateOgImageOptions) {
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

        <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.25)', marginBottom: 32 }} />

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

        <div
          style={{
            fontSize: title.length > 14 ? 72 : 96,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            textAlign: 'center',
            paddingInline: 48,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              marginTop: 28,
              textAlign: 'center',
              paddingInline: 48,
            }}
          >
            {subtitle}
          </div>
        ) : null}

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
          {footer ?? 'Istanbul, Turkey — Since 2008'}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE },
  );
}

import { ImageResponse } from 'next/og';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers } from '@/lib/db';

export const runtime = 'edge';
export const alt = 'Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let photographers = staticPhotographers;
  try {
    const db = await getPhotographers();
    if (db.length > 0) photographers = db;
  } catch {}

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fff',
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          f/2.8 Production
        </div>
      ),
      { ...size }
    );
  }

  const previewUrl = photographer.preview.startsWith('http')
    ? photographer.preview
    : `https://www.f28.com.tr${photographer.preview}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#000',
        }}
      >
        {/* Background preview image */}
        <img
          src={previewUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
          }}
        />

        {/* Gradient overlays */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
          }}
        >
          {/* Separator line */}
          <div
            style={{
              width: 48,
              height: 1,
              background: 'rgba(255,255,255,0.3)',
              marginBottom: 20,
            }}
          />

          {/* Title label */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {photographer.title}
          </div>

          {/* Photographer name */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {photographer.fullName}
          </div>

          {/* Agency name */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              marginTop: 24,
            }}
          >
            f/2.8 Production Agency
          </div>
        </div>

        {/* Top-right logo text */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 60,
            fontSize: 16,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.2em',
          }}
        >
          f/2.8
        </div>
      </div>
    ),
    { ...size }
  );
}

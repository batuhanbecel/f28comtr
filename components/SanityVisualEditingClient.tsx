'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// The overlay pulls in @sanity/ui, styled-components and framer-motion (~700KB).
// A static import put all of it on every public page; loaded here on demand,
// it only reaches editors in draft mode (this component renders only then).
const VisualEditing = dynamic(
  () => import('@sanity/visual-editing/react').then((mod) => mod.VisualEditing),
  { ssr: false },
);

export function SanityVisualEditingClient() {
  return (
    <>
      <VisualEditing portal={false} />
      <Link
        href="/api/draft-mode/disable"
        prefetch={false}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 9999,
          background: '#000',
          color: '#fff',
          padding: '0.5rem 1rem',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.2)',
          fontFamily: 'monospace',
        }}
      >
        Draft mode — Exit
      </Link>
    </>
  );
}

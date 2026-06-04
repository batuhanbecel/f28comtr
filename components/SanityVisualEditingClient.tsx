'use client';

import { VisualEditing } from '@sanity/visual-editing/react';
import Link from 'next/link';

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

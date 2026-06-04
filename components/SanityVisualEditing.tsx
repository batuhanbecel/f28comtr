import { draftMode } from 'next/headers';
import { SanityVisualEditingClient } from './SanityVisualEditingClient';

/**
 * Server component: only renders the Visual Editing overlay when draftMode
 * is enabled. The actual overlay (a client component) is loaded lazily.
 */
export async function SanityVisualEditing() {
  if (!(await draftMode()).isEnabled) return null;
  return <SanityVisualEditingClient />;
}

import { createClient } from 'next-sanity';
import { draftMode } from 'next/headers';

import { apiVersion, dataset, projectId, readToken, writeToken } from '@/sanity/env';

/**
 * Public CDN client (no token, fast). Used for published content on the live site.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/**
 * Draft-aware client: when Next.js draftMode() is enabled (Presentation Tool
 * iframe, Visual Editing), reads with the editor token, hits the API (not CDN),
 * and includes drafts. Otherwise behaves like the public client.
 *
 * The returned client also has `stega` enabled when in draft mode, which
 * encodes invisible "edit me" markers into string fields — Visual Editing
 * uses these to make any text on the page clickable back to its Sanity field.
 */
export async function getSanityFetchClient() {
  // draftMode() throws when called outside a request context
  // (e.g. generateStaticParams). Fall back to the public client in that case.
  let isDraft = false;
  try {
    isDraft = (await draftMode()).isEnabled;
  } catch {
    return sanityClient;
  }
  if (!isDraft) return sanityClient;
  if (!readToken) return sanityClient;
  return sanityClient.withConfig({
    token: readToken,
    useCdn: false,
    perspective: 'drafts',
    stega: { enabled: true, studioUrl: '/studio' },
  });
}

export function getReadClient() {
  if (!readToken) return sanityClient;
  return sanityClient.withConfig({ token: readToken, useCdn: false });
}

export function getWriteClient() {
  if (!writeToken) {
    throw new Error('SANITY_API_WRITE_TOKEN is not configured');
  }
  return sanityClient.withConfig({ token: writeToken, useCdn: false });
}

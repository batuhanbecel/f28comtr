import { getSanityFetchClient } from '@/lib/sanity.client';

/**
 * Draft-aware GROQ fetch. Inside Next.js draftMode (Presentation Tool iframe),
 * returns drafts with stega encoding so Visual Editing can wire any rendered
 * string back to its Sanity source. On the live site, returns published data
 * from the CDN.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const client = await getSanityFetchClient();
  return client.fetch<T>(query, params);
}

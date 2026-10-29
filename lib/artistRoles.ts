import type { Lang } from '@/lib/translations';

/**
 * What an artist does. One artist can hold several roles — photographers and
 * retouchers who also work as AI artists. Studio stores them as `roles`;
 * documents saved before that only have the single `title` string, which
 * `ROLES_GROQ` + `normalizeRoles` read as a one-role list.
 */
export const ARTIST_ROLES = ['PHOTOGRAPHER', 'RETOUCHER', 'AI_ARTIST'] as const;
export type ArtistRole = (typeof ARTIST_ROLES)[number];

/** GROQ: an artist's role list, falling back to the legacy single `title`. */
export const ROLES_GROQ = 'coalesce(roles, [title])';

/**
 * GROQ projection for a credited artist. The slug (the link) only when the
 * artist has a page — the site lists artists with a cover image, so one
 * added without a cover yet is credited by name alone instead of linking to a 404.
 */
export const CREDIT_PERSON = '{ "slug": select(defined(preview.asset) => slug.current), fullName }';

/** GROQ filter for reference pickers: artists that hold `role`. */
export function hasRoleFilter(role: ArtistRole): string {
  return `"${role}" in ${ROLES_GROQ}`;
}

/** Studio checkbox labels — the Studio UI is Turkish. */
export const ARTIST_ROLE_STUDIO_LABELS: Record<ArtistRole, string> = {
  PHOTOGRAPHER: 'Fotoğrafçı',
  RETOUCHER: 'Retoucher',
  AI_ARTIST: 'AI Artist',
};

/** English labels for places without a language: OG image, PDF, JSON-LD. */
export const ARTIST_ROLE_EN_LABELS: Record<ArtistRole, string> = {
  PHOTOGRAPHER: 'Photographer',
  RETOUCHER: 'Retoucher',
  AI_ARTIST: 'AI Artist',
};

/**
 * Known roles in display order (Photographer, Retoucher, AI Artist), without
 * duplicates. Accepts a list or a single legacy string ("PHOTOGRAPHER", "AI artist").
 * Nothing usable → photographer, as before roles existed.
 */
export function normalizeRoles(raw: unknown): ArtistRole[] {
  const values = (Array.isArray(raw) ? raw : [raw]).map((v) =>
    typeof v === 'string' ? v.trim().toUpperCase().replace(/[\s-]+/g, '_') : '',
  );
  const roles = ARTIST_ROLES.filter((role) => values.includes(role));
  return roles.length > 0 ? roles : ['PHOTOGRAPHER'];
}

/** On-page label, e.g. "Fotoğrafçı · AI Sanatçısı" — pass `t.titleMap` or a label map. */
export function formatRoles(
  roles: readonly ArtistRole[],
  labels: Partial<Record<string, string>>,
  separator = ' · ',
): string {
  return roles.map((role) => labels[role] ?? ARTIST_ROLE_EN_LABELS[role]).join(separator);
}

const ROLE_WORDS: Record<Lang, Record<ArtistRole, string>> = {
  en: { PHOTOGRAPHER: 'photographer', RETOUCHER: 'retoucher', AI_ARTIST: 'AI artist' },
  tr: { PHOTOGRAPHER: 'fotoğrafçı', RETOUCHER: 'rötuşçu', AI_ARTIST: 'AI sanatçısı' },
};

/**
 * Roles as words inside a sentence (meta descriptions):
 * "Photographer & AI artist", "fotoğrafçı ve AI sanatçısı".
 */
export function rolesPhrase(roles: readonly ArtistRole[], lang: Lang): string {
  const words = roles.map((role) => ROLE_WORDS[lang][role]);
  const last = words.pop() ?? '';
  const phrase = words.length > 0 ? `${words.join(', ')}${lang === 'tr' ? ' ve ' : ' & '}${last}` : last;
  // The English template opens its sentence with the role; the Turkish one doesn't.
  return lang === 'en' ? phrase.charAt(0).toUpperCase() + phrase.slice(1) : phrase;
}

/**
 * Normalizes a brand name into a URL/key-safe slug.
 * Handles Turkish characters explicitly before stripping the rest.
 */
export function deriveBrandKey(brand: string): string {
  return (
    brand
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'other'
  );
}

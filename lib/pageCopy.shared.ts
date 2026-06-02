/** Client-safe deep merge — arrays replace entirely. */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch?: Partial<T> | null,
): T {
  if (!patch) return structuredClone(base);

  const out = structuredClone(base) as Record<string, unknown>;

  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];
    if (value === undefined || value === null) continue;

    const existing = out[key as string];

    if (Array.isArray(value)) {
      out[key as string] = structuredClone(value);
      continue;
    }

    if (
      value !== null &&
      typeof value === 'object' &&
      existing !== null &&
      typeof existing === 'object' &&
      !Array.isArray(existing)
    ) {
      out[key as string] = deepMerge(
        existing as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      continue;
    }

    out[key as string] = value;
  }

  return out as T;
}

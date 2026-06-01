// Minimal stub for `next/headers` used by server modules under test.
export async function cookies() {
  return {
    get: (_name: string) => undefined as { value: string } | undefined,
  };
}

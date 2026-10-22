import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    // sanity/env.ts asserts these at import time; tests never hit the network.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project',
      NEXT_PUBLIC_SANITY_DATASET: 'test',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      // Server-only guards and next/headers can't run in the test env.
      'server-only': resolve(__dirname, 'tests/stubs/empty.ts'),
      'next/headers': resolve(__dirname, 'tests/stubs/next-headers.ts'),
    },
  },
});

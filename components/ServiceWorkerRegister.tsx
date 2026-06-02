'use client';

import { useEffect } from 'react';

function isLocalDevHost(): boolean {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Never keep a SW on local dev — stale caches break Turbopack HMR chunks.
    if (process.env.NODE_ENV !== 'production' || isLocalDevHost()) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      return;
    }

    navigator.serviceWorker.register('/sw.js?v=4').catch(() => {});
  }, []);

  return null;
}

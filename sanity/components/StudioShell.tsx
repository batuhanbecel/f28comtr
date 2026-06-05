'use client';

import { useEffect } from 'react';
import type { LayoutProps } from 'sanity';
import { useColorSchemeSetValue, useColorSchemeValue } from 'sanity';

/**
 * f/2.8 Studio kabuğu.
 *
 * - Studio'yu marka kimliğine uygun olacak şekilde karanlık şemaya zorlar
 *   (kullanıcı oturum içinde isterse açığa geçebilir; yeniden yüklemede tekrar
 *   karanlığa döner).
 * - `<html>` üzerine `data-f28-studio` işareti koyar → studio.css marka katmanı
 *   yalnızca bu işaret altında uygulanır, public site etkilenmez.
 */
export function StudioShell(props: LayoutProps) {
  const scheme = useColorSchemeValue();
  const setScheme = useColorSchemeSetValue();

  useEffect(() => {
    document.documentElement.setAttribute('data-f28-studio', '');
    return () => document.documentElement.removeAttribute('data-f28-studio');
  }, []);

  useEffect(() => {
    if (scheme !== 'dark' && typeof setScheme === 'function') {
      setScheme('dark');
    }
    // Yalnızca ilk montajda zorla — oturum içi kullanıcı tercihini ezme.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return props.renderDefault(props);
}

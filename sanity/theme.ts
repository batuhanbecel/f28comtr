import { buildLegacyTheme } from 'sanity';

/**
 * f/2.8 — minimal editorial Studio teması.
 *
 * Önemli: `--default-button-primary-color` ve `--component-text-color` gibi
 * doğrudan kontrasta etki eden değişkenlere DOKUNULMAZ. Bunlar Sanity'nin
 * default'unda kalır — aksi takdirde Publish/Discard butonlarının yazısı
 * arkasıyla aynı renge gelip görünmez kalıyor.
 */
const props = {
  // Ana marka rengi — vurgu, focus, primary action background.
  '--brand-primary': '#111111',
  '--focus-color': '#111111',

  // Üst nav (workspace selector + tool menu) arka planı — site teması ile uyumlu.
  '--main-navigation-color': '#0a0a0a',
  '--main-navigation-color--inverted': '#ffffff',
};

export const studioTheme = buildLegacyTheme(props);

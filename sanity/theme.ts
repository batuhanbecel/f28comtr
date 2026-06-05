import { buildLegacyTheme } from 'sanity';

/**
 * f/2.8 Studio teması — "production command center".
 *
 * Karanlık, sinematik bir taban: yakın-siyah arka plan, yumuşak beyaz tipografi,
 * sönük gri kenarlıklar ve tek bir sıcak vurgu tonu (ACCENT). Tüm marka rengi
 * buradaki `ACCENT` tokenı üzerinden kontrol edilir.
 *
 * NOT (kontrast): `buildLegacyTheme`, birincil buton yazı rengini brand renginden
 * okunabilirliğe göre otomatik hesaplar. Bu yüzden brand'ı saf siyah DEĞİL, orta
 * tonlu bir vurgu (ACCENT) veriyoruz → Publish/Discard butonlarının yazısı her
 * zaman okunur kalır. (studio.css ayrıca güvenlik ağı olarak zorlar.)
 */

/** Tek marka vurgu tonu — değiştirmek için yalnızca burayı düzenleyin. */
export const STUDIO_ACCENT = '#C9A24B';

/** Studio karanlık şemaya zorlanır (bkz. StudioShell); değerler dark için ayarlı. */
const NEAR_BLACK = '#08080A';
const PANEL_BG = '#131316';
const SOFT_WHITE = '#ECECEF';
const MUTED_GRAY = '#7E7E88';

export const studioTheme = buildLegacyTheme({
  '--black': NEAR_BLACK,
  '--white': '#F4F4F6',

  '--gray-base': MUTED_GRAY,
  '--gray': MUTED_GRAY,

  '--component-bg': PANEL_BG,
  '--component-text-color': SOFT_WHITE,

  // Marka / vurgu
  '--brand-primary': STUDIO_ACCENT,

  // Butonlar
  '--default-button-color': '#16161A',
  '--default-button-primary-color': STUDIO_ACCENT,
  '--default-button-success-color': '#3AA76D',
  '--default-button-warning-color': '#D9A441',
  '--default-button-danger-color': '#D8503E',

  // Durum renkleri
  '--state-info-color': STUDIO_ACCENT,
  '--state-success-color': '#3AA76D',
  '--state-warning-color': '#D9A441',
  '--state-danger-color': '#D8503E',

  // Navigasyon (üst bar + workspace menüsü)
  '--main-navigation-color': NEAR_BLACK,
  '--main-navigation-color--inverted': SOFT_WHITE,

  '--focus-color': STUDIO_ACCENT,
});

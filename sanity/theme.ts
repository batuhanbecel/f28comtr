import { buildLegacyTheme } from 'sanity';

/**
 * f/2.8 Studio teması.
 *
 * Üst navbar f/2.8 siyahıyla markalaştırılmış. İçerik alanı Sanity'nin
 * varsayılan açık temasını kullanır — hem kontrast hem de kullanılabilirlik
 * bu kombinasyonla en yüksek seviyede.
 *
 * NOT: `--brand-primary` kasıtlı olarak mavi tonda bırakıldı.
 * Siyah verildiğinde `buildLegacyTheme` Publish/Discard butonlarının
 * yazısını arka planla aynı renge hesaplar → görünmez kalır.
 * Navigation için siyah kullanmak yeterli; action butonları default mavi
 * kalınca kontrast sorunsuz olur.
 */
export const studioTheme = buildLegacyTheme({
  '--main-navigation-color': '#111111',
  '--main-navigation-color--inverted': '#ffffff',
  '--focus-color': '#111111',
});

import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { AiPortfolioGalleryDesk } from './components/AiPortfolioGalleryDesk';
import { StudioOverview } from './components/StudioOverview';
import {
  UsersIcon,
  RobotIcon,
  ImagesIcon,
  HomeIcon,
  ImageIcon,
  DesktopIcon,
  EarthGlobeIcon,
  ControlsIcon,
  TagIcon,
  DashboardIcon,
  DocumentIcon,
  EnvelopeIcon,
  CaseIcon,
} from '@sanity/icons';

const SINGLETONS = new Set([
  'siteAssets',
  'aiPoweredCollection',
  'homeV2PageCopy',
  'productionPageCopy',
  'aiPoweredPageCopy',
  'contactPageCopy',
]);

/**
 * Desk order follows the site: overview, the home page (edited most), then
 * artists, production, AI, the other pages, media and SEO. List ids are
 * stable — the overview links to them (`sanatcilar`, `projeler`,
 * `ai-powered;ai-portfolyo`, `seo`).
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('f/2.8 Yönetim')
    .items([
      S.listItem()
        .id('genel-bakis')
        .title('Genel Bakış')
        .icon(DashboardIcon)
        .child(S.component().id('f28-overview').title('Genel Bakış').component(StudioOverview)),

      S.listItem()
        .id('anasayfa')
        .title('Anasayfa')
        .icon(HomeIcon)
        .child(
          S.document()
            .id('metinlerHomeV2')
            .schemaType('homeV2PageCopy')
            .documentId('homeV2PageCopy')
            .title('Anasayfa'),
        ),

      S.divider().title('İçerik'),

      orderableDocumentListDeskItem({
        type: 'photographer',
        id: 'sanatcilar',
        title: 'Fotoğrafçılar & Retoucherlar',
        icon: UsersIcon,
        S,
        context,
      }),

      orderableDocumentListDeskItem({
        type: 'productionProject',
        id: 'projeler',
        title: 'Prodüksiyon Projeleri',
        icon: CaseIcon,
        S,
        context,
      }),

      S.listItem()
        .id('ai-powered')
        .title('AI Powered')
        .icon(RobotIcon)
        .child(
          S.list()
            .title('AI Powered')
            .items([
              S.listItem()
                .id('ai-calismalar')
                .title('Çalışma Galerisi')
                .icon(ControlsIcon)
                .child(
                  S.document()
                    .schemaType('aiPoweredCollection')
                    .documentId('aiPoweredCollection')
                    .title('AI Powered Çalışmalar'),
                ),
              S.listItem()
                .id('ai-portfolyo')
                .title('Portfolyo Görselleri')
                .icon(ImagesIcon)
                .child(
                  S.component()
                    .id('ai-portfolio-gallery')
                    .title('AI Portfolyo Görselleri')
                    .component(AiPortfolioGalleryDesk),
                ),
              S.listItem()
                .id('ai-etiketler')
                .title('Etiket Tanımları')
                .icon(TagIcon)
                .child(S.documentTypeList('aiTag').title('AI Portfolyo Etiketleri')),
            ]),
        ),

      S.divider().title('Sayfalar & Site'),

      S.listItem()
        .id('sayfalar')
        .title('Diğer Sayfalar')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Diğer Sayfalar')
            .items([
              S.listItem()
                .id('production')
                .title('Production Sayfası')
                .icon(DesktopIcon)
                .child(
                  S.document()
                    .schemaType('productionPageCopy')
                    .documentId('productionPageCopy')
                    .title('Production Sayfası'),
                ),
              S.listItem()
                .id('ai-powered-sayfasi')
                .title('AI Powered Sayfası')
                .icon(RobotIcon)
                .child(
                  S.document()
                    .schemaType('aiPoweredPageCopy')
                    .documentId('aiPoweredPageCopy')
                    .title('AI Powered Sayfası'),
                ),
              S.listItem()
                .id('iletisim')
                .title('İletişim Sayfası')
                .icon(EnvelopeIcon)
                .child(
                  S.document()
                    .schemaType('contactPageCopy')
                    .documentId('contactPageCopy')
                    .title('İletişim Sayfası'),
                ),
            ]),
        ),

      S.listItem()
        .id('site-gorselleri')
        .title('Site Görselleri & Logolar')
        .icon(ImageIcon)
        .child(
          S.document()
            .schemaType('siteAssets')
            .documentId('siteAssets')
            .title('Site Görselleri & Logolar'),
        ),

      S.listItem()
        .id('seo')
        .title('SEO Düzenlemeleri')
        .icon(EarthGlobeIcon)
        .child(S.documentTypeList('seoOverride').title('SEO Düzenlemeleri')),
    ]);

export const isSingleton = (type: string): boolean => SINGLETONS.has(type);

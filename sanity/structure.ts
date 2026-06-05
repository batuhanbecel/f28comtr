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
  CogIcon,
} from '@sanity/icons';

const SINGLETONS = new Set([
  'siteAssets',
  'aiPoweredCollection',
  'homeV2PageCopy',
  'productionPageCopy',
  'aiPoweredPageCopy',
  'contactPageCopy',
]);

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('f/2.8 Yönetim')
    .items([
      // ── Genel Bakış (command center) ───────────────────────────────────
      S.listItem()
        .id('genel-bakis')
        .title('Genel Bakış')
        .icon(DashboardIcon)
        .child(
          S.component()
            .id('f28-overview')
            .title('Genel Bakış')
            .component(StudioOverview),
        ),

      S.divider(),

      // ── Sanatçılar ─────────────────────────────────────────────────────
      orderableDocumentListDeskItem({
        type: 'photographer',
        title: 'Fotoğrafçılar & Retoucherlar',
        icon: UsersIcon,
        S,
        context,
      }),

      S.divider(),

      // ── AI Powered ─────────────────────────────────────────────────────
      S.listItem()
        .title('AI Powered')
        .icon(RobotIcon)
        .child(
          S.list()
            .title('AI Powered')
            .items([
              S.listItem()
                .id('aiPortfolyoGorselleri')
                .title('Portfolyo Görselleri')
                .icon(ImagesIcon)
                .child(
                  S.component()
                    .id('ai-portfolio-gallery')
                    .title('AI Portfolyo Görselleri')
                    .component(AiPortfolioGalleryDesk),
                ),
              S.listItem()
                .title('Çalışma Galerisi')
                .icon(ControlsIcon)
                .child(
                  S.document()
                    .schemaType('aiPoweredCollection')
                    .documentId('aiPoweredCollection')
                    .title('AI Powered Çalışmalar'),
                ),
              S.listItem()
                .title('Etiket Tanımları')
                .icon(TagIcon)
                .child(S.documentTypeList('aiTag').title('AI Portfolyo Etiketleri')),
            ]),
        ),

      S.divider(),

      // ── Sayfalar ───────────────────────────────────────────────────────
      S.listItem()
        .title('Sayfalar')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Sayfalar')
            .items([
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
              S.listItem()
                .title('Production Sayfası')
                .icon(DesktopIcon)
                .child(
                  S.document()
                    .schemaType('productionPageCopy')
                    .documentId('productionPageCopy')
                    .title('Production Sayfası'),
                ),
              S.listItem()
                .title('AI Powered Sayfası')
                .icon(RobotIcon)
                .child(
                  S.document()
                    .schemaType('aiPoweredPageCopy')
                    .documentId('aiPoweredPageCopy')
                    .title('AI Powered Sayfası'),
                ),
              S.listItem()
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

      S.divider(),

      // ── Site Ayarları & Medya ──────────────────────────────────────────
      S.listItem()
        .title('Site Ayarları & Medya')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Ayarları & Medya')
            .items([
              S.listItem()
                .title('Site Görselleri & Logolar')
                .icon(ImageIcon)
                .child(
                  S.document()
                    .schemaType('siteAssets')
                    .documentId('siteAssets')
                    .title('Site Görselleri & Logolar'),
                ),
            ]),
        ),

      S.divider(),

      // ── SEO ────────────────────────────────────────────────────────────
      S.listItem()
        .title('SEO Düzenlemeleri')
        .icon(EarthGlobeIcon)
        .child(S.documentTypeList('seoOverride').title('SEO Düzenlemeleri')),
    ]);

export const isSingleton = (type: string): boolean => SINGLETONS.has(type);

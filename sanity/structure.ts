import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

const SINGLETONS = new Set([
  'siteAssets',
  'aiPoweredCollection',
  'homeSelectedWorks',
  'productionPageCopy',
  'aiPoweredPageCopy',
  'contactPageCopy',
]);

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('İçerik')
    .items([
      orderableDocumentListDeskItem({
        type: 'photographer',
        title: 'Fotoğrafçılar',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('AI Powered')
        .child(
          S.list()
            .title('AI Powered')
            .items([
              S.listItem()
                .title('Çalışmalar')
                .child(
                  S.document()
                    .schemaType('aiPoweredCollection')
                    .documentId('aiPoweredCollection'),
                ),
              orderableDocumentListDeskItem({
                type: 'aiPortfolioItem',
                title: 'Portfolyo Görselleri',
                S,
                context,
              }),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Anasayfa Öne Çıkan İşler')
        .child(
          S.document()
            .schemaType('homeSelectedWorks')
            .documentId('homeSelectedWorks'),
        ),
      S.divider(),
      S.listItem()
        .title('Site Görselleri')
        .child(
          S.document().schemaType('siteAssets').documentId('siteAssets'),
        ),
      S.listItem()
        .title('Production Sayfası')
        .child(
          S.document()
            .schemaType('productionPageCopy')
            .documentId('productionPageCopy'),
        ),
      S.listItem()
        .title('AI Powered Sayfası')
        .child(
          S.document()
            .schemaType('aiPoweredPageCopy')
            .documentId('aiPoweredPageCopy'),
        ),
      S.listItem()
        .title('İletişim Sayfası')
        .child(
          S.document()
            .schemaType('contactPageCopy')
            .documentId('contactPageCopy'),
        ),
      S.divider(),
      S.listItem()
        .title('SEO Düzenlemeleri')
        .child(S.documentTypeList('seoOverride').title('SEO Düzenlemeleri')),
    ]);

export const isSingleton = (type: string): boolean => SINGLETONS.has(type);

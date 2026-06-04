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
    .title('f/2.8')
    .items([
      orderableDocumentListDeskItem({
        type: 'photographer',
        title: 'Photographers',
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
                .title('Works')
                .child(
                  S.document()
                    .schemaType('aiPoweredCollection')
                    .documentId('aiPoweredCollection'),
                ),
              orderableDocumentListDeskItem({
                type: 'aiPortfolioItem',
                title: 'Portfolio Items',
                S,
                context,
              }),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Home Selected Works')
        .child(
          S.document()
            .schemaType('homeSelectedWorks')
            .documentId('homeSelectedWorks'),
        ),
      S.divider(),
      S.listItem()
        .title('Site Assets')
        .child(
          S.document().schemaType('siteAssets').documentId('siteAssets'),
        ),
      S.listItem()
        .title('Production Page Copy')
        .child(
          S.document()
            .schemaType('productionPageCopy')
            .documentId('productionPageCopy'),
        ),
      S.listItem()
        .title('AI Powered Page Copy')
        .child(
          S.document()
            .schemaType('aiPoweredPageCopy')
            .documentId('aiPoweredPageCopy'),
        ),
      S.listItem()
        .title('Contact Page Copy')
        .child(
          S.document()
            .schemaType('contactPageCopy')
            .documentId('contactPageCopy'),
        ),
      S.divider(),
      S.listItem()
        .title('SEO Overrides')
        .child(S.documentTypeList('seoOverride').title('SEO Overrides')),
    ]);

export const isSingleton = (type: string): boolean => SINGLETONS.has(type);

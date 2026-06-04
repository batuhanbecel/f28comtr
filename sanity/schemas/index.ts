import type { SchemaTypeDefinition } from 'sanity';

import { localizedString, localizedText } from './_objects/localizedString';
import { photographer } from './photographer';
import { aiPoweredCollection } from './aiPoweredCollection';
import { aiPortfolioItem } from './aiPortfolioItem';
import { homeSelectedWorks } from './homeSelectedWorks';
import { siteAssets } from './siteAssets';
import { productionPageCopy } from './productionPageCopy';
import { aiPoweredPageCopy } from './aiPoweredPageCopy';
import { contactPageCopy } from './contactPageCopy';
import { seoOverride } from './seoOverride';

export const schemaTypes: SchemaTypeDefinition[] = [
  localizedString,
  localizedText,
  photographer,
  aiPoweredCollection,
  aiPortfolioItem,
  homeSelectedWorks,
  siteAssets,
  productionPageCopy,
  aiPoweredPageCopy,
  contactPageCopy,
  seoOverride,
];

import type { SchemaTypeDefinition } from 'sanity';

import { localizedString, localizedText } from './_objects/localizedString';
import { photographer } from './photographer';
import { productionProject } from './productionProject';
import { aiPoweredCollection } from './aiPoweredCollection';
import { aiPortfolioItem } from './aiPortfolioItem';
import { siteAssets } from './siteAssets';
import { productionPageCopy } from './productionPageCopy';
import { aiPoweredPageCopy } from './aiPoweredPageCopy';
import { contactPageCopy } from './contactPageCopy';
import { homeV2PageCopy } from './homeV2PageCopy';
import { aiTag } from './aiTag';
import { seoOverride } from './seoOverride';

export const schemaTypes: SchemaTypeDefinition[] = [
  localizedString,
  localizedText,
  photographer,
  productionProject,
  aiPoweredCollection,
  aiPortfolioItem,
  aiTag,
  homeV2PageCopy,
  siteAssets,
  productionPageCopy,
  aiPoweredPageCopy,
  contactPageCopy,
  seoOverride,
];

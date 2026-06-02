import type { translations } from '@/lib/translations';

import type { Lang } from '@/lib/translations';

export type PageCopyKey = 'production' | 'aiPowered' | 'contact';

export type SeoCopy = { title: string; description: string };

export type ProductionPageCopy = (typeof translations.en)['production'] & {
  statsValues: { projects: string; brands: string; sinceYear: string };
  seo: SeoCopy;
};

export type AiPoweredPageCopy = (typeof translations.en)['aiPowered'] & {
  statsValues: { sinceYear: string };
  seo: SeoCopy;
};

export type ContactPageCopy = (typeof translations.en)['contact'] & {
  info: {
    email: string;
    instagram: string;
    linkedin: string;
    address: string;
    city: string;
  };
  seo: SeoCopy;
};

export type PageCopyByKey = {
  production: ProductionPageCopy;
  aiPowered: AiPoweredPageCopy;
  contact: ContactPageCopy;
};

export type SiteCopyStore = Partial<{
  production: Partial<Record<Lang, Partial<ProductionPageCopy>>>;
  aiPowered: Partial<Record<Lang, Partial<AiPoweredPageCopy>>>;
  contact: Partial<Record<Lang, Partial<ContactPageCopy>>>;
}>;

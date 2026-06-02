'use client';

import type { ReactNode } from 'react';
import { EditorialPageHero, type EditorialHeroPage } from '@/components/EditorialPageHero';
import type { Lang } from '@/lib/translations';

type HeroPage = EditorialHeroPage;

interface LocalizedHeroProps {
  page: HeroPage;
  lang: Lang;
  imageCount?: number;
  children?: ReactNode;
  scrollSnap?: boolean;
}

/** @deprecated Prefer EditorialPageHero for full-viewport heroes */
export function PageHero({ page, lang, children, scrollSnap }: LocalizedHeroProps) {
  return (
    <EditorialPageHero page={page} lang={lang} scrollSnap={scrollSnap}>
      {children}
    </EditorialPageHero>
  );
}

export function LocalizedHero(props: LocalizedHeroProps) {
  return <PageHero {...props} />;
}

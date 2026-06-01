'use client';

import type { ReactNode } from 'react';
import { EditorialPageHero, type EditorialHeroPage } from '@/components/EditorialPageHero';

type HeroPage = EditorialHeroPage;

interface LocalizedHeroProps {
  page: HeroPage;
  imageCount?: number;
  children?: ReactNode;
  scrollSnap?: boolean;
}

/** @deprecated Prefer EditorialPageHero for full-viewport heroes */
export function PageHero({ page, children, scrollSnap }: LocalizedHeroProps) {
  return (
    <EditorialPageHero page={page} scrollSnap={scrollSnap}>
      {children}
    </EditorialPageHero>
  );
}

export function LocalizedHero(props: LocalizedHeroProps) {
  return <PageHero {...props} />;
}

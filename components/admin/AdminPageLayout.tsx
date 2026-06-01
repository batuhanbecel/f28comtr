import Link from 'next/link';
import type { ReactNode } from 'react';

interface AdminPageLayoutProps {
  title: string;
  label?: string;
  breadcrumb?: { href: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
  maxWidth?: '4xl' | '7xl';
}

export function AdminPageLayout({
  title,
  label = 'Admin',
  breadcrumb,
  actions,
  children,
  maxWidth = '7xl',
}: AdminPageLayoutProps) {
  const maxClass = maxWidth === '4xl' ? 'max-w-4xl' : 'max-w-7xl';

  return (
    <div className="min-h-screen">
      <header className="border-b border-th-fg/10 pl-16 pr-6 md:px-10 py-6 sticky top-0 bg-th-surface/95 backdrop-blur-md z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="page-heading-stack gap-2">
            {breadcrumb ? (
              <Link
                href={breadcrumb.href}
                className="text-th-fg/35 text-[10px] tracking-[0.35em] uppercase hover:text-th-fg/70 transition-colors w-fit"
              >
                ← {breadcrumb.label}
              </Link>
            ) : (
              <span className="section-label section-label--pill">{label}</span>
            )}
            <h1 className="heading-section">{title}</h1>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </header>
      <div className={`${maxClass} mx-auto px-6 md:px-10 py-10 md:py-12`}>{children}</div>
    </div>
  );
}

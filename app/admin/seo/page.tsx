'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminFormField, AdminInput, AdminTextarea } from '@/components/admin/AdminFormField';
import { useAdminT } from '@/hooks/useAdminT';
import type { SeoCopy } from '@/lib/pageCopy.types';
import type { SeoPageKey } from '@/lib/seo';
import type { Lang } from '@/lib/translations';

const SEO_PAGES: { key: SeoPageKey; label: string; path: string }[] = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'production', label: 'Production', path: '/production' },
  { key: 'aiPowered', label: 'AI-Powered', path: '/ai-powered' },
  { key: 'aiPoweredPortfolio', label: 'AI Portfolio', path: '/ai-powered/portfolio' },
  { key: 'portfolios', label: 'Portfolios', path: '/portfolios' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'contact', label: 'Contact', path: '/contact' },
];

export default function SeoAdminPage() {
  const a = useAdminT();
  const s = a.seo;
  const router = useRouter();
  const [page, setPage] = useState<SeoPageKey>('home');
  const [lang, setLang] = useState<Lang>('en');
  const [seo, setSeo] = useState<SeoCopy | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const requestKey = `${page}:${lang}`;

  const loadSeo = useCallback(
    async (signal?: AbortSignal) => {
      const key = `${page}:${lang}`;
      setLoading(true);
      setLoadedFor(null);
      try {
        const res = await fetch(`/api/admin/seo?page=${page}&lang=${lang}`, { signal });
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!res.ok) {
          toast.error(a.toast.loadFailed);
          return;
        }
        const data = await res.json();
        if (signal?.aborted) return;
        setSeo(data.seo as SeoCopy);
        setLoadedFor(key);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        toast.error(a.toast.loadFailed);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [a.toast.loadFailed, lang, page, router],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadSeo(controller.signal);
    return () => controller.abort();
  }, [loadSeo]);

  const save = async () => {
    if (!seo) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, lang, seo }),
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('save failed');
      toast.success(s.saved);
    } catch {
      toast.error(a.toast.failed);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm(s.resetConfirm)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/seo?page=${page}&lang=${lang}`, { method: 'DELETE' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('reset failed');
      const data = await res.json();
      setSeo(data.seo as SeoCopy);
      setLoadedFor(`${page}:${lang}`);
      toast.success(s.resetDone);
    } catch {
      toast.error(a.toast.failed);
    } finally {
      setSaving(false);
    }
  };

  const currentTab = SEO_PAGES.find((p) => p.key === page);

  return (
    <AdminPageLayout
      title={s.title}
      actions={
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="ghost" onClick={reset} disabled={saving || loading}>
            {s.reset}
          </AdminButton>
          <AdminButton onClick={save} disabled={saving || loading || !seo}>
            {saving ? a.actions.saving : a.actions.save}
          </AdminButton>
        </div>
      }
    >
      <p className="admin-muted mb-8 max-w-3xl">{s.intro}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {SEO_PAGES.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              if (tab.key === page) return;
              setPage(tab.key);
              setSeo(null);
              setLoadedFor(null);
              setLoading(true);
            }}
            className={`btn-editorial text-[10px] ${page === tab.key ? 'btn-editorial--primary' : 'btn-editorial--light'}`}
          >
            {tab.label}
          </button>
        ))}
        <Link
          href={currentTab?.path ?? '/'}
          target="_blank"
          className="btn-editorial btn-editorial--ghost text-[10px] ml-auto"
        >
          {a.actions.viewPage}
        </Link>
      </div>

      <div className="flex gap-2 mb-8">
        <span className="admin-label self-center">{s.language}</span>
        {(['en', 'tr'] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => {
              if (code === lang) return;
              setLang(code);
              setSeo(null);
              setLoadedFor(null);
              setLoading(true);
            }}
            className={`btn-editorial text-[10px] ${lang === code ? 'btn-editorial--primary' : 'btn-editorial--light'}`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      {loading || !seo || loadedFor !== requestKey ? (
        <p className="admin-muted">{a.actions.loading}</p>
      ) : (
        <AdminPanel title={s.panelTitle}>
          <div className="grid gap-4">
            <AdminFormField label={s.titleField}>
              <AdminInput value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
            </AdminFormField>
            <AdminFormField label={s.descriptionField}>
              <AdminTextarea
                value={seo.description}
                onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                rows={4}
              />
            </AdminFormField>
          </div>
        </AdminPanel>
      )}
    </AdminPageLayout>
  );
}

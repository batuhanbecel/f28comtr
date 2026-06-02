'use client';

import type { AdminTranslations } from '@/lib/adminTranslations';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminFormField, AdminInput, AdminTextarea } from '@/components/admin/AdminFormField';
import { useAdminT } from '@/hooks/useAdminT';
import type {
  AiPoweredPageCopy,
  ContactPageCopy,
  PageCopyKey,
  ProductionPageCopy,
} from '@/lib/pageCopy.types';
import type { Lang } from '@/lib/translations';
import { deepMerge } from '@/lib/pageCopy.shared';

type AnyPageCopy = ProductionPageCopy | AiPoweredPageCopy | ContactPageCopy;

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <AdminFormField label={label}>
      {multiline ? (
        <AdminTextarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <AdminInput value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </AdminFormField>
  );
}

export default function PageCopyAdminClient() {
  const a = useAdminT();
  const pc = a.pageCopy;
  const router = useRouter();
  const [page, setPage] = useState<PageCopyKey>('production');
  const [lang, setLang] = useState<Lang>('en');
  const [copy, setCopy] = useState<AnyPageCopy | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const requestKey = `${page}:${lang}`;

  const beginLoad = useCallback(() => {
    setCopy(null);
    setLoadedFor(null);
    setLoading(true);
  }, []);

  const switchPage = (next: PageCopyKey) => {
    if (next === page) return;
    setPage(next);
    beginLoad();
  };

  const switchLang = (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    beginLoad();
  };

  const loadCopy = useCallback(
    async (signal?: AbortSignal) => {
      const key = `${page}:${lang}`;
      setLoading(true);
      setLoadedFor(null);
      try {
        const res = await fetch(`/api/admin/page-copy?page=${page}&lang=${lang}`, { signal });
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
        if (key !== `${page}:${lang}`) return;
        const defaults = (data.defaults ?? {}) as Record<string, unknown>;
        const merged = deepMerge(
          defaults,
          deepMerge(defaults, (data.copy ?? {}) as Record<string, unknown>),
        ) as AnyPageCopy;
        setCopy(merged);
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
    void loadCopy(controller.signal);
    return () => controller.abort();
  }, [loadCopy]);

  const save = async () => {
    if (!copy) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/page-copy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, lang, copy }),
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('save failed');
      toast.success(pc.saved);
    } catch {
      toast.error(a.toast.failed);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm(pc.resetConfirm)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/page-copy?page=${page}&lang=${lang}`, { method: 'DELETE' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('reset failed');
      const data = await res.json();
      setCopy(data.copy as AnyPageCopy);
      setLoadedFor(`${page}:${lang}`);
      toast.success(pc.resetDone);
    } catch {
      toast.error(a.toast.failed);
    } finally {
      setSaving(false);
    }
  };

  const pageTabs: { key: PageCopyKey; label: string; href: string }[] = [
    { key: 'production', label: pc.pages.production, href: '/production' },
    { key: 'aiPowered', label: pc.pages.aiPowered, href: '/ai-powered' },
    { key: 'contact', label: pc.pages.contact, href: '/contact' },
  ];

  return (
    <AdminPageLayout
      title={pc.title}
      actions={
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="ghost" onClick={reset} disabled={saving || loading}>
            {pc.reset}
          </AdminButton>
          <AdminButton onClick={save} disabled={saving || loading || !copy}>
            {saving ? a.actions.saving : a.actions.save}
          </AdminButton>
        </div>
      }
    >
      <p className="admin-muted mb-8 max-w-3xl">{pc.intro}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {pageTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => switchPage(tab.key)}
            className={`btn-editorial text-[10px] ${page === tab.key ? 'btn-editorial--primary' : 'btn-editorial--light'}`}
          >
            {tab.label}
          </button>
        ))}
        <Link
          href={pageTabs.find((t) => t.key === page)?.href ?? '/'}
          target="_blank"
          className="btn-editorial btn-editorial--ghost text-[10px] ml-auto"
        >
          {a.actions.viewPage}
        </Link>
      </div>

      <div className="flex gap-2 mb-8">
        <span className="admin-label self-center">{pc.language}</span>
        {(['en', 'tr'] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => switchLang(code)}
            className={`btn-editorial text-[10px] ${lang === code ? 'btn-editorial--primary' : 'btn-editorial--light'}`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      {loading || !copy || loadedFor !== requestKey ? (
        <p className="admin-muted">{a.actions.loading}</p>
      ) : page === 'production' ? (
        <ProductionCopyForm copy={copy as ProductionPageCopy} setCopy={setCopy} pc={pc} />
      ) : page === 'aiPowered' ? (
        <AiPoweredCopyForm copy={copy as AiPoweredPageCopy} setCopy={setCopy} pc={pc} />
      ) : (
        <ContactCopyForm copy={copy as ContactPageCopy} setCopy={setCopy} pc={pc} />
      )}
    </AdminPageLayout>
  );
}

function ProductionCopyForm({
  copy,
  setCopy,
  pc,
}: {
  copy: ProductionPageCopy;
  setCopy: React.Dispatch<React.SetStateAction<AnyPageCopy | null>>;
  pc: AdminTranslations['pageCopy'];
}) {
  const update = (patch: Partial<ProductionPageCopy>) =>
    setCopy((prev) =>
      deepMerge(prev as Record<string, unknown>, patch as Record<string, unknown>) as ProductionPageCopy,
    );

  const services = copy.services ?? { sectionLabel: '', heading: '', items: [] };
  const process = copy.process ?? { sectionLabel: '', heading: '', steps: [] };
  const deliverables = copy.deliverables ?? { sectionLabel: '', heading: '', items: [] };
  const team = copy.team ?? { sectionLabel: '', description: '', cta: '' };
  const stats = copy.stats ?? { projects: '', brands: '', since: '' };
  const statsValues = copy.statsValues ?? { projects: '', brands: '', sinceYear: '' };
  const serviceItems = services.items ?? [];
  const processSteps = process.steps ?? [];
  const deliverableItems = deliverables.items ?? [];

  return (
    <div className="space-y-8">
      <AdminPanel title={pc.sections.hero}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={pc.fields.sectionLabel} value={copy.sectionLabel} onChange={(v) => update({ sectionLabel: v })} />
          <TextField label={pc.fields.heading} value={copy.heading} onChange={(v) => update({ heading: v })} />
          <div className="md:col-span-2">
            <TextField label={pc.fields.description} value={copy.description} onChange={(v) => update({ description: v })} multiline />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.stats}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={stats.projects} value={stats.projects} onChange={(v) => update({ stats: { ...stats, projects: v } })} />
          <TextField label={stats.brands} value={stats.brands} onChange={(v) => update({ stats: { ...stats, brands: v } })} />
          <TextField label={stats.since} value={stats.since} onChange={(v) => update({ stats: { ...stats, since: v } })} />
          <TextField label={pc.fields.statProjects} value={statsValues.projects} onChange={(v) => update({ statsValues: { ...statsValues, projects: v } })} />
          <TextField label={pc.fields.statBrands} value={statsValues.brands} onChange={(v) => update({ statsValues: { ...statsValues, brands: v } })} />
          <TextField label={pc.fields.statSince} value={statsValues.sinceYear} onChange={(v) => update({ statsValues: { ...statsValues, sinceYear: v } })} />
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.services}>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <TextField label={pc.fields.sectionLabel} value={services.sectionLabel} onChange={(v) => update({ services: { ...services, sectionLabel: v } })} />
          <TextField label={pc.fields.heading} value={services.heading} onChange={(v) => update({ services: { ...services, heading: v } })} />
        </div>
        <div className="space-y-6">
          {serviceItems.map((item, i) => (
            <div key={`service-${i}`} className="border-t border-th-fg/10 pt-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="admin-label">{`${pc.fields.itemTitle} ${i + 1}`}</span>
                <AdminButton
                  variant="ghost"
                  className="!text-red-500/80 hover:!text-red-500"
                  onClick={() => {
                    const items = serviceItems.filter((_, idx) => idx !== i);
                    update({ services: { ...services, items } });
                  }}
                >
                  {pc.removeItem}
                </AdminButton>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label={pc.fields.title} value={item.title} onChange={(v) => {
                  const items = [...serviceItems];
                  items[i] = { ...items[i], title: v };
                  update({ services: { ...services, items } });
                }} />
                <TextField label={pc.fields.itemDescription} value={item.description} onChange={(v) => {
                  const items = [...serviceItems];
                  items[i] = { ...items[i], description: v };
                  update({ services: { ...services, items } });
                }} multiline />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <AdminButton
            variant="ghost"
            onClick={() =>
              update({
                services: {
                  ...services,
                  items: [...serviceItems, { title: '', description: '' }],
                },
              })
            }
          >
            {pc.addService}
          </AdminButton>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.process}>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <TextField label={pc.fields.sectionLabel} value={process.sectionLabel} onChange={(v) => update({ process: { ...process, sectionLabel: v } })} />
          <TextField label={pc.fields.heading} value={process.heading} onChange={(v) => update({ process: { ...process, heading: v } })} />
        </div>
        <div className="space-y-4">
          {processSteps.map((step, i) => (
            <div key={`step-${i}`} className="border-t border-th-fg/10 pt-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="admin-label">{`${pc.fields.stepTitle} ${i + 1}`}</span>
                <AdminButton
                  variant="ghost"
                  className="!text-red-500/80 hover:!text-red-500"
                  onClick={() => {
                    const steps = processSteps.filter((_, idx) => idx !== i);
                    update({ process: { ...process, steps } });
                  }}
                >
                  {pc.removeItem}
                </AdminButton>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label={pc.fields.stepTitle} value={step.title} onChange={(v) => {
                  const steps = [...processSteps];
                  steps[i] = { ...steps[i], title: v };
                  update({ process: { ...process, steps } });
                }} />
                <TextField label={pc.fields.stepSub} value={step.sub} onChange={(v) => {
                  const steps = [...processSteps];
                  steps[i] = { ...steps[i], sub: v };
                  update({ process: { ...process, steps } });
                }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <AdminButton
            variant="ghost"
            onClick={() =>
              update({
                process: {
                  ...process,
                  steps: [...processSteps, { title: '', sub: '' }],
                },
              })
            }
          >
            {pc.addStep}
          </AdminButton>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.deliverables}>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <TextField label={pc.fields.sectionLabel} value={deliverables.sectionLabel} onChange={(v) => update({ deliverables: { ...deliverables, sectionLabel: v } })} />
          <TextField label={pc.fields.heading} value={deliverables.heading} onChange={(v) => update({ deliverables: { ...deliverables, heading: v } })} />
        </div>
        <div className="space-y-4">
          {deliverableItems.map((item, i) => (
            <div key={`deliverable-${i}`} className="flex flex-col sm:flex-row sm:items-end gap-3 border-t border-th-fg/10 pt-4">
              <div className="flex-1">
                <TextField label={`${pc.fields.deliverable} ${i + 1}`} value={item} onChange={(v) => {
                  const items = [...deliverableItems];
                  items[i] = v;
                  update({ deliverables: { ...deliverables, items } });
                }} />
              </div>
              <AdminButton
                variant="ghost"
                className="!text-red-500/80 hover:!text-red-500 shrink-0"
                onClick={() => {
                  const items = deliverableItems.filter((_, idx) => idx !== i);
                  update({ deliverables: { ...deliverables, items } });
                }}
              >
                {pc.removeItem}
              </AdminButton>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <AdminButton
            variant="ghost"
            onClick={() =>
              update({
                deliverables: {
                  ...deliverables,
                  items: [...deliverableItems, ''],
                },
              })
            }
          >
            {pc.addDeliverable}
          </AdminButton>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.team}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={pc.fields.sectionLabel} value={team.sectionLabel} onChange={(v) => update({ team: { ...team, sectionLabel: v } })} />
          <TextField label={pc.fields.cta} value={team.cta} onChange={(v) => update({ team: { ...team, cta: v } })} />
          <div className="md:col-span-2">
            <TextField label={pc.fields.description} value={team.description} onChange={(v) => update({ team: { ...team, description: v } })} multiline />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.marquee}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Marquee label" value={copy.marqueeLabel} onChange={(v) => update({ marqueeLabel: v })} />
          <TextField label="Row label" value={copy.marqueeRow} onChange={(v) => update({ marqueeRow: v })} />
          <TextField label="View image" value={copy.marqueeViewImage} onChange={(v) => update({ marqueeViewImage: v })} />
        </div>
      </AdminPanel>

      <SeoPanel seo={copy.seo ?? { title: '', description: '' }} onChange={(seo) => update({ seo })} pc={pc} />
    </div>
  );
}

function AiPoweredCopyForm({
  copy,
  setCopy,
  pc,
}: {
  copy: AiPoweredPageCopy;
  setCopy: React.Dispatch<React.SetStateAction<AnyPageCopy | null>>;
  pc: AdminTranslations['pageCopy'];
}) {
  const update = (patch: Partial<AiPoweredPageCopy>) =>
    setCopy((prev) =>
      deepMerge(prev as Record<string, unknown>, patch as Record<string, unknown>) as AiPoweredPageCopy,
    );

  const stats = copy.stats ?? { projects: '', brands: '', since: '' };
  const statsValues = copy.statsValues ?? { sinceYear: '' };
  const processBlock = copy.process ?? { sectionLabel: '', heading: '', steps: [] };
  const filters = copy.filters ?? {};
  const processSteps = processBlock.steps ?? [];

  return (
    <div className="space-y-8">
      <AdminPanel title={pc.sections.hero}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={pc.fields.sectionLabel} value={copy.sectionLabel} onChange={(v) => update({ sectionLabel: v })} />
          <TextField label={pc.fields.heading} value={copy.heading} onChange={(v) => update({ heading: v })} />
          <div className="md:col-span-2">
            <TextField label={pc.fields.description} value={copy.description} onChange={(v) => update({ description: v })} multiline />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.stats}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={stats.projects} value={stats.projects} onChange={(v) => update({ stats: { ...stats, projects: v } })} />
          <TextField label={stats.brands} value={stats.brands} onChange={(v) => update({ stats: { ...stats, brands: v } })} />
          <TextField label={stats.since} value={stats.since} onChange={(v) => update({ stats: { ...stats, since: v } })} />
          <TextField label={pc.fields.statSince} value={statsValues.sinceYear} onChange={(v) => update({ statsValues: { sinceYear: v } })} />
          <TextField label="Works suffix" value={copy.worksLabel ?? ''} onChange={(v) => update({ worksLabel: v })} />
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.process}>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <TextField label={pc.fields.sectionLabel} value={processBlock.sectionLabel} onChange={(v) => update({ process: { ...processBlock, sectionLabel: v } })} />
          <TextField label={pc.fields.heading} value={processBlock.heading} onChange={(v) => update({ process: { ...processBlock, heading: v } })} />
        </div>
        <div className="space-y-4">
          {processSteps.map((step, i) => (
            <div key={`ai-step-${i}`} className="border-t border-th-fg/10 pt-4">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  className="text-[10px] uppercase tracking-widest text-red-400/80 hover:text-red-400"
                  onClick={() => {
                    const steps = processSteps.filter((_, idx) => idx !== i);
                    update({ process: { ...processBlock, steps } });
                  }}
                >
                  {pc.removeItem}
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label={`${pc.fields.stepTitle} ${i + 1}`} value={step.title} onChange={(v) => {
                  const steps = [...processSteps];
                  steps[i] = { ...steps[i], title: v };
                  update({ process: { ...processBlock, steps } });
                }} />
                <TextField label={`${pc.fields.stepSub} ${i + 1}`} value={step.sub} onChange={(v) => {
                  const steps = [...processSteps];
                  steps[i] = { ...steps[i], sub: v };
                  update({ process: { ...processBlock, steps } });
                }} />
              </div>
            </div>
          ))}
          <AdminButton
            variant="ghost"
            onClick={() => {
              const steps = [...processSteps, { title: '', sub: '' }];
              update({ process: { ...processBlock, steps } });
            }}
          >
            {pc.addStep}
          </AdminButton>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.filters}>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(filters).map(([key, value]) => (
            <TextField key={key} label={key} value={value} onChange={(v) => update({ filters: { ...filters, [key]: v } })} />
          ))}
        </div>
      </AdminPanel>

      <SeoPanel seo={copy.seo ?? { title: '', description: '' }} onChange={(seo) => update({ seo })} pc={pc} />
    </div>
  );
}

function ContactCopyForm({
  copy,
  setCopy,
  pc,
}: {
  copy: ContactPageCopy;
  setCopy: React.Dispatch<React.SetStateAction<AnyPageCopy | null>>;
  pc: AdminTranslations['pageCopy'];
}) {
  const update = (patch: Partial<ContactPageCopy>) =>
    setCopy((prev) =>
      deepMerge(prev as Record<string, unknown>, patch as Record<string, unknown>) as ContactPageCopy,
    );

  const info = copy.info ?? {
    email: '',
    instagram: '',
    linkedin: '',
    address: '',
    city: '',
  };
  const form = copy.form ?? {};

  return (
    <div className="space-y-8">
      <AdminPanel title={pc.sections.hero}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={pc.fields.sectionLabel} value={copy.sectionLabel} onChange={(v) => update({ sectionLabel: v })} />
          <TextField label={pc.fields.heading} value={copy.heading} onChange={(v) => update({ heading: v })} />
          <div className="md:col-span-2">
            <TextField label={pc.fields.description} value={copy.description} onChange={(v) => update({ description: v })} multiline />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.channels}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={pc.fields.sectionLabel} value={copy.channelsLabel} onChange={(v) => update({ channelsLabel: v })} />
          <TextField label={pc.fields.heading} value={copy.channelsHeading} onChange={(v) => update({ channelsHeading: v })} />
          <TextField label={copy.emailLabel} value={copy.emailLabel} onChange={(v) => update({ emailLabel: v })} />
          <TextField label={copy.instagramLabel} value={copy.instagramLabel} onChange={(v) => update({ instagramLabel: v })} />
          <TextField label={copy.linkedinLabel} value={copy.linkedinLabel} onChange={(v) => update({ linkedinLabel: v })} />
          <TextField label={copy.addressLabel} value={copy.addressLabel} onChange={(v) => update({ addressLabel: v })} />
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.contactInfo}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label={pc.fields.email} value={info.email} onChange={(v) => update({ info: { ...info, email: v } })} />
          <TextField label={pc.fields.instagram} value={info.instagram} onChange={(v) => update({ info: { ...info, instagram: v } })} />
          <TextField label={pc.fields.linkedin} value={info.linkedin} onChange={(v) => update({ info: { ...info, linkedin: v } })} />
          <TextField label={pc.fields.address} value={info.address} onChange={(v) => update({ info: { ...info, address: v } })} multiline />
          <TextField label={pc.fields.city} value={info.city} onChange={(v) => update({ info: { ...info, city: v } })} />
        </div>
      </AdminPanel>

      <AdminPanel title={pc.sections.form}>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <TextField label={pc.fields.sectionLabel} value={copy.formLabel} onChange={(v) => update({ formLabel: v })} />
          <TextField label={pc.fields.heading} value={copy.formHeading} onChange={(v) => update({ formHeading: v })} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(form).map(([key, value]) => (
            <TextField key={key} label={key} value={value} onChange={(v) => update({ form: { ...form, [key]: v } })} multiline={key === 'success' || key === 'error'} />
          ))}
        </div>
      </AdminPanel>

      <SeoPanel seo={copy.seo ?? { title: '', description: '' }} onChange={(seo) => update({ seo })} pc={pc} />
    </div>
  );
}

function SeoPanel({
  seo,
  onChange,
  pc,
}: {
  seo: { title: string; description: string };
  onChange: (seo: { title: string; description: string }) => void;
  pc: AdminTranslations['pageCopy'];
}) {
  return (
    <AdminPanel title={pc.sections.seo}>
      <div className="grid gap-4">
        <TextField label={pc.fields.seoTitle} value={seo.title} onChange={(v) => onChange({ ...seo, title: v })} />
        <TextField label={pc.fields.seoDescription} value={seo.description} onChange={(v) => onChange({ ...seo, description: v })} multiline />
      </div>
    </AdminPanel>
  );
}

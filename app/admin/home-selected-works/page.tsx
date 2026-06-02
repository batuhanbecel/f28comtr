'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import type { Photographer } from '@/lib/data';
import type { HomeSelectedWorkStored } from '@/lib/homeSelectedWorks.shared';
import { HOME_SELECTED_WORKS_MAX } from '@/lib/homeSelectedWorks.shared';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminFormField, AdminInput, AdminSelect } from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { useAdminT } from '@/hooks/useAdminT';
import { formatAdmin } from '@/lib/adminI18n';

export default function AdminHomeSelectedWorks() {
  const a = useAdminT();
  const hs = a.homeSelectedWorks;
  const router = useRouter();
  const [works, setWorks] = useState<HomeSelectedWorkStored[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [pickerId, setPickerId] = useState('');
  const [pickerImages, setPickerImages] = useState<string[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dragItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/home-selected-works');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setWorks(data.works || []);
    } catch {
      toast.error(a.toast.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [router, a.toast.loadFailed]);

  const fetchPhotographers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photographers');
      if (!res.ok) return;
      const list = await res.json();
      if (Array.isArray(list)) setPhotographers(list);
    } catch {
      /* optional for picker */
    }
  }, []);

  useEffect(() => {
    fetchWorks();
    fetchPhotographers();
  }, [fetchWorks, fetchPhotographers]);

  useEffect(() => {
    if (!pickerId) {
      setPickerImages([]);
      return;
    }
    let cancelled = false;
    setPickerLoading(true);
    fetch(`/api/admin/photographers/${pickerId}/images`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPickerImages(Array.isArray(data.images) ? data.images : []);
      })
      .catch(() => {
        if (!cancelled) toast.error(hs.loadPortfolioFailed);
      })
      .finally(() => {
        if (!cancelled) setPickerLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pickerId, hs.loadPortfolioFailed]);

  const photographerName = (id: string) =>
    photographers.find((p) => p.id === id)?.fullName ?? id;

  const updateWork = (idx: number, patch: Partial<HomeSelectedWorkStored>) => {
    setWorks((prev) => prev.map((w, i) => (i === idx ? { ...w, ...patch } : w)));
    setDirty(true);
  };

  const removeWork = (idx: number) => {
    setWorks((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const addWork = (imageSrc: string, photographerId: string) => {
    if (works.length >= HOME_SELECTED_WORKS_MAX) {
      toast.error(formatAdmin(hs.maxReached, { max: HOME_SELECTED_WORKS_MAX }));
      return;
    }
    if (works.some((w) => w.imageSrc === imageSrc)) {
      toast.error(hs.alreadyAdded);
      return;
    }
    setWorks((prev) => [
      ...prev,
      {
        id: `home-work-${Date.now()}-${prev.length}`,
        imageSrc,
        workTitle: '',
        photographerId,
      },
    ]);
    setDirty(true);
    toast.success(hs.added);
  };

  const handleSave = async () => {
    const missingTitle = works.find((w) => !w.workTitle.trim());
    if (missingTitle) {
      toast.error(hs.titleRequired);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/home-selected-works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ works }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(formatAdmin(hs.saved, { count: data.count }));
        setDirty(false);
      } else {
        toast.error(data.error || a.toast.failed);
      }
    } catch {
      toast.error(a.toast.failed);
    } finally {
      setSaving(false);
    }
  };

  const moveWork = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= works.length) return;
    const next = [...works];
    [next[idx], next[target]] = [next[target], next[idx]];
    setWorks(next);
    setDirty(true);
  };

  const onDragStart = (idx: number) => {
    dragItem.current = idx;
    setDragIndex(idx);
  };

  const onDragEnter = (idx: number) => {
    if (dragItem.current === null || dragItem.current === idx) return;
    const next = [...works];
    const [moved] = next.splice(dragItem.current, 1);
    next.splice(idx, 0, moved);
    dragItem.current = idx;
    setWorks(next);
    setDirty(true);
  };

  const onDragEnd = () => {
    dragItem.current = null;
    setDragIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 w-full max-w-4xl px-8">
          <div className="h-10 bg-th-fg/[0.03] animate-pulse w-48" />
          <div className="grid grid-cols-3 gap-2 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-th-fg/[0.03] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title={hs.title}
      breadcrumb={{ href: '/admin', label: a.nav.dashboard }}
      actions={
        <>
          {dirty ? (
            <span className="text-amber-400/70 text-[10px] tracking-[0.3em] uppercase">
              {a.status.unsaved}
            </span>
          ) : null}
          <Link href="/home-v2" target="_blank" className="btn-editorial text-[10px]">
            {hs.viewPreview}
          </Link>
          <AdminButton variant="primary" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? a.actions.saving : a.actions.save}
          </AdminButton>
        </>
      }
    >
      <p className="admin-muted text-xs mb-8">{hs.intro}</p>
      <p className="admin-muted text-[10px] tracking-[0.25em] uppercase mb-8">
        {formatAdmin(hs.count, { count: works.length, max: HOME_SELECTED_WORKS_MAX })}
      </p>

      <AdminPanel label={hs.pickerLabel} title={hs.pickerTitle} className="mb-10">
        <AdminFormField label={hs.photographer} className="max-w-md mb-6">
          <AdminSelect
            value={pickerId}
            onChange={(e) => setPickerId(e.target.value)}
          >
            <option value="">{hs.choosePhotographer}</option>
            {photographers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </AdminSelect>
        </AdminFormField>

        {!pickerId ? (
          <p className="admin-muted text-xs">{hs.choosePhotographerHint}</p>
        ) : pickerLoading ? (
          <p className="admin-muted text-xs">{a.actions.loading}</p>
        ) : pickerImages.length === 0 ? (
          <p className="admin-muted text-xs">{hs.noPortfolioImages}</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {pickerImages.map((src) => {
              const selected = works.some((w) => w.imageSrc === src);
              return (
                <button
                  key={src}
                  type="button"
                  disabled={selected || works.length >= HOME_SELECTED_WORKS_MAX}
                  onClick={() => addWork(src, pickerId)}
                  className={`relative aspect-[4/3] overflow-hidden border transition-colors ${
                    selected
                      ? 'border-th-fg/30 opacity-40 cursor-not-allowed'
                      : 'border-th-fg/[0.08] hover:border-th-fg/30 cursor-pointer'
                  }`}
                  title={selected ? hs.alreadyAdded : hs.addImage}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized={shouldSkipOptimization(src)}
                  />
                </button>
              );
            })}
          </div>
        )}
      </AdminPanel>

      {works.length === 0 ? (
        <div className="text-center py-20 border border-th-fg/[0.05]">
          <p className="admin-muted text-xs tracking-[0.4em] uppercase">{hs.noWorks}</p>
          <p className="admin-muted text-[10px] mt-2">{hs.noWorksHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work, idx) => (
            <div
              key={work.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragEnter={() => onDragEnter(idx)}
              onDragEnd={onDragEnd}
              className={`border border-th-fg/[0.08] bg-th-bg ${
                dragIndex === idx ? 'opacity-50' : ''
              }`}
            >
              <div className="relative aspect-[4/3] bg-th-fg/[0.03]">
                <Image
                  src={work.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized={shouldSkipOptimization(work.imageSrc)}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveWork(idx, -1)}
                    disabled={idx === 0}
                    className="px-2 py-1 text-[9px] uppercase tracking-widest bg-th-bg/90 border border-th-fg/10 disabled:opacity-30"
                    aria-label={hs.moveUp}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveWork(idx, 1)}
                    disabled={idx === works.length - 1}
                    className="px-2 py-1 text-[9px] uppercase tracking-widest bg-th-bg/90 border border-th-fg/10 disabled:opacity-30"
                    aria-label={hs.moveDown}
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3 border-t border-th-fg/[0.06]">
                <p className="text-[9px] tracking-[0.35em] uppercase text-th-fg/40">
                  {photographerName(work.photographerId)}
                </p>
                <AdminFormField label={hs.workTitle}>
                  <AdminInput
                    type="text"
                    value={work.workTitle}
                    placeholder={hs.workTitlePlaceholder}
                    onChange={(e) => updateWork(idx, { workTitle: e.target.value })}
                  />
                </AdminFormField>
                <AdminButton
                  variant="ghost"
                  className="w-full text-[10px]"
                  onClick={() => removeWork(idx)}
                >
                  {hs.remove}
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
}

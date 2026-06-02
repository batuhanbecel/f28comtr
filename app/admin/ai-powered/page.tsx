'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import type { AiPoweredWork, WorkCategory } from '@/lib/aiPoweredWorks';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminFormField, AdminInput, AdminSelect } from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminDropzone } from '@/components/admin/AdminDropzone';
import { AdminUploadQueue } from '@/components/admin/AdminUploadQueue';
import { useAdminT } from '@/hooks/useAdminT';
import { formatAdmin } from '@/lib/adminI18n';
import { deriveBrandKey } from '@/lib/brandKey';

interface UploadProgress {
  fileName: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

const MAX_CLIENT_SIZE = 3.5 * 1024 * 1024;
const MAX_CLIENT_DIM = 3000;

async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_CLIENT_SIZE) return file;
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_CLIENT_DIM || height > MAX_CLIENT_DIM) {
        const r = Math.min(MAX_CLIENT_DIM / width, MAX_CLIENT_DIM / height);
        width = Math.round(width * r); height = Math.round(height * r);
      }
      const c = document.createElement('canvas'); c.width = width; c.height = height;
      const ctx = c.getContext('2d'); if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);
      c.toBlob((b) => { if (!b) { resolve(file); return; } resolve(new File([b], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })); }, 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function AdminAiPowered() {
  const a = useAdminT();
  const categoryOptions: { key: WorkCategory; label: string }[] = [
    { key: 'visual', label: a.categories.visual },
    { key: 'video', label: a.categories.video },
    { key: 'hybrid', label: a.categories.hybrid },
  ];
  const router = useRouter();
  const [works, setWorks] = useState<AiPoweredWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dragItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [defaultBrand, setDefaultBrand] = useState('');
  const [defaultCategory, setDefaultCategory] = useState<WorkCategory>('visual');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const abortRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ai-powered-works');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setWorks(data.works || []);
    } catch {
      toast.error(a.toast.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [router, a.toast.loadFailed]);

  useEffect(() => { fetchWorks(); }, [fetchWorks]);

  const knownBrands = Array.from(
    new Map(works.map((w) => [w.brandKey, w.brand])).entries()
  ).map(([key, label]) => ({ key, label }));

  const visibleWorks = works
    .map((w, idx) => ({ w, idx }))
    .filter(({ w }) => {
      if (filterBrand !== 'all' && w.brandKey !== filterBrand) return false;
      if (filterCategory !== 'all' && w.category !== filterCategory) return false;
      return true;
    });

  const updateWork = (idx: number, patch: Partial<AiPoweredWork>) => {
    setWorks(prev => prev.map((w, i) => {
      if (i !== idx) return w;
      const merged = { ...w, ...patch };
      if (patch.brand !== undefined) merged.brandKey = deriveBrandKey(patch.brand);
      return merged;
    }));
    setDirty(true);
  };

  const uploadFiles = useCallback(async (files: File[]) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'image/avif', 'image/heic', 'image/heif'];
    const imageFiles = files.filter(f => allowed.includes(f.type));
    if (imageFiles.length === 0) { toast.error('No valid image files'); return; }
    const brand = defaultBrand.trim() || 'Other';
    abortRef.current = false;
    setIsUploading(true);
    const queue: UploadProgress[] = imageFiles.map(f => ({ fileName: f.name, status: 'pending' as const }));
    setUploadQueue(queue);
    let successCount = 0;
    for (let i = 0; i < imageFiles.length; i++) {
      if (abortRef.current) break;
      setUploadQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'uploading' } : item));
      let fileToUpload: File;
      try { fileToUpload = await compressImage(imageFiles[i]); } catch { fileToUpload = imageFiles[i]; }
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('type', 'ai');
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          const newWork: AiPoweredWork = {
            id: `work-${Date.now()}-${i}`,
            brand,
            brandKey: deriveBrandKey(brand),
            title: '',
            description: '',
            category: defaultCategory,
            imageSrc: data.url,
            imageAlt: `${brand} AI-powered image`,
            year: new Date().getFullYear(),
          };
          setWorks(prev => [...prev, newWork]);
          setDirty(true);
          setUploadQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'done' } : item));
          successCount++;
        } else {
          const data = await res.json().catch(() => ({ error: 'Upload failed' }));
          setUploadQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'error', error: data.error } : item));
        }
      } catch {
        setUploadQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'error', error: 'Network error' } : item));
      }
    }
    setIsUploading(false);
    if (successCount > 0) toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded — remember to Save`);
  }, [defaultBrand, defaultCategory]);

  const handleDelete = async (work: AiPoweredWork, idx: number) => {
    if (!confirm(`Delete this image? (${work.brand})`)) return;
    try {
      await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: work.imageSrc, type: 'ai' }),
      });
    } catch {}
    setWorks(prev => prev.filter((_, i) => i !== idx));
    setDirty(true);
    toast.success('Image removed — Save to persist');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-powered-works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ works }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Saved ${data.count} works`);
        setDirty(false);
      } else {
        toast.error(data.error || 'Save failed');
      }
    } catch {
      toast.error('Save failed');
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
          <div className="grid grid-cols-4 gap-2 mt-8">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/3] bg-th-fg/[0.03] animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title={a.aiPowered.title}
      breadcrumb={{ href: '/admin', label: a.nav.dashboard }}
      actions={
        <>
          {dirty ? <span className="text-amber-400/70 text-[10px] tracking-[0.3em] uppercase">{a.status.unsaved}</span> : null}
          <Link href="/admin/ai-powered/portfolio" className="btn-editorial text-[10px]">
            {a.nav.aiPoweredPortfolio}
          </Link>
          <Link href="/ai-powered" target="_blank" className="btn-editorial text-[10px]">
            {a.actions.viewPage}
          </Link>
          <AdminButton onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {a.actions.upload}
          </AdminButton>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
          <AdminButton variant="primary" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? a.actions.saving : a.actions.save}
          </AdminButton>
        </>
      }
    >
      <p className="admin-muted text-xs mb-8">
        {formatAdmin(a.aiPowered.count, { count: works.length })}
      </p>

      <AdminPanel label={a.aiPowered.upload} title={a.aiPowered.defaults} className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <AdminFormField label={a.aiPowered.brandNext} className="min-w-[180px] flex-1">
            <AdminInput
              type="text"
              placeholder={a.aiPowered.brandPlaceholder}
              value={defaultBrand}
              onChange={(e) => setDefaultBrand(e.target.value)}
              list="brand-suggestions"
            />
          </AdminFormField>
          <datalist id="brand-suggestions">
            {knownBrands.map(b => <option key={b.key} value={b.label} />)}
          </datalist>
          <AdminFormField label={a.aiPowered.type}>
            <AdminSelect
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value as WorkCategory)}
            >
              {categoryOptions.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </AdminSelect>
          </AdminFormField>
        </div>
      </AdminPanel>

      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length) uploadFiles(Array.from(e.dataTransfer.files)); }}
        className="mb-6"
      >
        <AdminDropzone
          onFiles={(files) => uploadFiles(Array.from(files))}
          accept="image/*"
          disabled={isUploading}
          hint={a.dropzone.dropImages}
          className={isDragOver ? 'border-th-fg/40 bg-th-fg/[0.06]' : ''}
        />
      </div>

      <AdminUploadQueue
        queue={uploadQueue}
        isUploading={isUploading}
        onCancel={() => {
          abortRef.current = true;
        }}
      />

        {/* Filters */}
        {works.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="section-label opacity-70">{a.filters.filter}</span>
            <AdminSelect
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="all">{a.filters.allBrands}</option>
              {knownBrands.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
            </AdminSelect>
            <AdminSelect
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">{a.filters.allTypes}</option>
              {categoryOptions.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </AdminSelect>
            <span className="admin-muted ml-2">{visibleWorks.length} / {works.length}</span>
          </div>
        )}

        {works.length === 0 ? (
          <div className="text-center py-20 border border-th-fg/[0.05]">
            <p className="admin-muted text-xs tracking-[0.4em] uppercase">{a.aiPowered.noWorks}</p>
            <p className="admin-muted text-[10px] mt-2">{a.aiPowered.noWorksHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleWorks.map(({ w: work, idx }) => (
              <div
                key={work.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragEnter={() => onDragEnter(idx)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className={`group relative border border-th-fg/[0.08] bg-th-fg/[0.02] transition-all duration-150 ${
                  dragIndex === idx ? 'opacity-40 scale-95 ring-1 ring-th-fg/30' : 'opacity-100'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden cursor-grab active:cursor-grabbing">
                  <Image
                    src={work.imageSrc}
                    alt={work.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={shouldSkipOptimization(work.imageSrc)}
                  />
                  <div className="absolute top-1.5 left-1.5 bg-th-bg/70 px-2 py-0.5">
                    <span className="text-th-fg/70 text-[9px] font-mono">{idx + 1}</span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveWork(idx, -1); }}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center bg-th-bg/70 text-th-fg/60 hover:text-th-fg hover:bg-th-bg/90 disabled:opacity-20 text-xs"
                    >↑</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveWork(idx, 1); }}
                      disabled={idx === works.length - 1}
                      className="w-6 h-6 flex items-center justify-center bg-th-bg/70 text-th-fg/60 hover:text-th-fg hover:bg-th-bg/90 disabled:opacity-20 text-xs"
                    >↓</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(work, idx); }}
                      className="w-6 h-6 flex items-center justify-center bg-th-bg/70 text-red-400/70 hover:text-red-400 hover:bg-th-bg/90 text-xs"
                    >✕</button>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">{a.aiPowered.brand}</label>
                    <input
                      type="text"
                      value={work.brand}
                      onChange={(e) => updateWork(idx, { brand: e.target.value })}
                      list="brand-suggestions"
                      className="w-full bg-th-bg border border-th-fg/[0.1] px-2 py-1.5 text-xs text-th-fg/85 focus:outline-none focus:border-th-fg/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">{a.aiPowered.type}</label>
                      <select
                        value={work.category}
                        onChange={(e) => updateWork(idx, { category: e.target.value as WorkCategory })}
                        className="w-full bg-th-bg border border-th-fg/[0.1] px-2 py-1.5 text-xs text-th-fg/85 focus:outline-none focus:border-th-fg/40"
                      >
                        {categoryOptions.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">{a.aiPowered.year}</label>
                      <input
                        type="number"
                        value={work.year}
                        onChange={(e) => updateWork(idx, { year: Number(e.target.value) || work.year })}
                        className="w-full bg-th-bg border border-th-fg/[0.1] px-2 py-1.5 text-xs text-th-fg/85 focus:outline-none focus:border-th-fg/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">{a.aiPowered.titleOptional}</label>
                    <input
                      type="text"
                      value={work.title}
                      onChange={(e) => updateWork(idx, { title: e.target.value })}
                      placeholder="Shown on hover"
                      className="w-full bg-th-bg border border-th-fg/[0.1] px-2 py-1.5 text-xs text-th-fg/85 focus:outline-none focus:border-th-fg/40"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {dirty && works.length > 0 && (
        <div className="mt-6 flex justify-end">
          <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </AdminButton>
        </div>
      )}
    </AdminPageLayout>
  );
}

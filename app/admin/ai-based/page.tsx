'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import type { AIWork, WorkCategory } from '@/lib/aiWorks';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminFormField, AdminInput, AdminSelect } from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminDropzone } from '@/components/admin/AdminDropzone';

interface UploadProgress {
  fileName: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

const MAX_CLIENT_SIZE = 3.5 * 1024 * 1024;
const MAX_CLIENT_DIM = 3000;
const CATEGORY_OPTIONS: { key: WorkCategory; label: string }[] = [
  { key: 'visual', label: 'Visual' },
  { key: 'video', label: 'Video' },
  { key: 'hybrid', label: 'Hybrid' },
];

function deriveBrandKey(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'other';
}

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

export default function AdminAIBased() {
  const router = useRouter();
  const [works, setWorks] = useState<AIWork[]>([]);
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
      const res = await fetch('/api/admin/ai-works');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setWorks(data.works || []);
    } catch {
      toast.error('Failed to load AI works');
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  const updateWork = (idx: number, patch: Partial<AIWork>) => {
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
          const newWork: AIWork = {
            id: `work-${Date.now()}-${i}`,
            brand,
            brandKey: deriveBrandKey(brand),
            title: '',
            description: '',
            category: defaultCategory,
            imageSrc: data.url,
            imageAlt: `${brand} AI image`,
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

  const handleDelete = async (work: AIWork, idx: number) => {
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
      const res = await fetch('/api/admin/ai-works', {
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
      title="Works"
      breadcrumb={{ href: '/admin', label: 'Dashboard' }}
      actions={
        <>
          {dirty ? <span className="text-amber-400/70 text-[10px] tracking-[0.3em] uppercase">• Unsaved</span> : null}
          <Link href="/ai-based" target="_blank" className="btn-editorial text-[10px]">
            View Page ↗
          </Link>
          <AdminButton onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            + Upload
          </AdminButton>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
          <AdminButton variant="primary" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? 'Saving...' : 'Save'}
          </AdminButton>
        </>
      }
    >
      <p className="text-th-fg/25 text-xs mb-8">
        {works.length} works — tag each with brand and type, drag to reorder
      </p>

      <AdminPanel label="Upload" title="Defaults" className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <AdminFormField label="Brand (next upload)" className="min-w-[180px] flex-1">
            <AdminInput
              type="text"
              placeholder="Brand (e.g. Puma)"
              value={defaultBrand}
              onChange={(e) => setDefaultBrand(e.target.value)}
              list="brand-suggestions"
            />
          </AdminFormField>
          <datalist id="brand-suggestions">
            {knownBrands.map(b => <option key={b.key} value={b.label} />)}
          </datalist>
          <AdminFormField label="Type">
            <AdminSelect
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value as WorkCategory)}
            >
              {CATEGORY_OPTIONS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
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
          hint="Drop images or click to upload"
          className={isDragOver ? 'border-th-fg/40 bg-th-fg/[0.06]' : ''}
        />
      </div>

        {uploadQueue.length > 0 && (
          <div className="mb-6 border border-th-fg/[0.08] divide-y divide-th-fg/[0.05] max-h-48 overflow-y-auto">
            {isUploading && (
              <div className="px-4 py-2 flex justify-between items-center bg-th-fg/[0.02]">
                <span className="text-th-fg/40 text-[10px] tracking-widest uppercase">
                  Uploading {uploadQueue.filter(q => q.status === 'done').length}/{uploadQueue.length}
                </span>
                <button onClick={() => { abortRef.current = true; }} className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest uppercase">Cancel</button>
              </div>
            )}
            {uploadQueue.map((item, i) => (
              <div key={i} className="px-4 py-2 flex items-center justify-between text-xs">
                <span className="text-th-fg/50 truncate max-w-[60%]">{item.fileName}</span>
                <span className={`text-[10px] tracking-wider ${
                  item.status === 'done' ? 'text-green-400/70' : item.status === 'error' ? 'text-red-400/70' : item.status === 'uploading' ? 'text-th-fg/50' : 'text-th-fg/20'
                }`}>
                  {item.status === 'uploading' ? 'Uploading...' : item.status === 'done' ? '✓' : item.status === 'error' ? item.error || 'Failed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {works.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-th-fg/40 text-[10px] tracking-[0.3em] uppercase">Filter</span>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="bg-th-bg border border-th-fg/[0.12] px-3 py-1.5 text-th-fg/80 focus:outline-none focus:border-th-fg/40"
            >
              <option value="all">All brands</option>
              {knownBrands.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-th-bg border border-th-fg/[0.12] px-3 py-1.5 text-th-fg/80 focus:outline-none focus:border-th-fg/40"
            >
              <option value="all">All types</option>
              {CATEGORY_OPTIONS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <span className="text-th-fg/30 ml-2">{visibleWorks.length} / {works.length}</span>
          </div>
        )}

        {works.length === 0 ? (
          <div className="text-center py-20 border border-th-fg/[0.05]">
            <p className="text-th-fg/20 text-xs tracking-[0.4em] uppercase">No AI works found</p>
            <p className="text-th-fg/10 text-xs mt-2">Drop images above or click Upload to add works</p>
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
                    <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">Brand</label>
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
                      <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">Type</label>
                      <select
                        value={work.category}
                        onChange={(e) => updateWork(idx, { category: e.target.value as WorkCategory })}
                        className="w-full bg-th-bg border border-th-fg/[0.1] px-2 py-1.5 text-xs text-th-fg/85 focus:outline-none focus:border-th-fg/40"
                      >
                        {CATEGORY_OPTIONS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">Year</label>
                      <input
                        type="number"
                        value={work.year}
                        onChange={(e) => updateWork(idx, { year: Number(e.target.value) || work.year })}
                        className="w-full bg-th-bg border border-th-fg/[0.1] px-2 py-1.5 text-xs text-th-fg/85 focus:outline-none focus:border-th-fg/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-th-fg/30 text-[9px] tracking-[0.2em] uppercase mb-1">Title (optional)</label>
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

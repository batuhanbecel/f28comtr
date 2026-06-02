'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import { deriveTagId, type AiPortfolioItem, type AiPortfolioTag } from '@/lib/aiPoweredPortfolio.shared';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminDropzone } from '@/components/admin/AdminDropzone';
import { AdminUploadQueue } from '@/components/admin/AdminUploadQueue';
import { AdminFormField, AdminInput } from '@/components/admin/AdminFormField';
import { useAdminT } from '@/hooks/useAdminT';
import { formatAdmin } from '@/lib/adminI18n';

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

export default function AdminAiPoweredPortfolio() {
  const a = useAdminT();
  const router = useRouter();
  const [tags, setTags] = useState<AiPortfolioTag[]>([]);
  const [items, setItems] = useState<AiPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [defaultTagIds, setDefaultTagIds] = useState<string[]>([]);
  const [newTagEn, setNewTagEn] = useState('');
  const [newTagTr, setNewTagTr] = useState('');
  const abortRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ai-powered-portfolio');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setTags(data.tags || []);
      setItems(data.items || (data.images || []).map((src: string) => ({ src, tagIds: [] })));
    } catch {
      toast.error(a.toast.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [router, a.toast.loadFailed]);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const uploadFiles = useCallback(async (files: File[]) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'image/avif', 'image/heic', 'image/heif'];
    const imageFiles = files.filter(f => allowed.includes(f.type));
    if (imageFiles.length === 0) { toast.error('No valid image files'); return; }
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
      formData.append('type', 'ai_portfolio');
      formData.append('tagIds', JSON.stringify(defaultTagIds));
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setItems(prev => [...prev, { src: data.url, tagIds: [...defaultTagIds] }]);
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
    if (successCount > 0) toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded`);
  }, [defaultTagIds]);

  const handleDeleteImage = async (img: string, index: number) => {
    if (!confirm('Delete this portfolio image?')) return;
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: img, type: 'ai_portfolio' }),
      });
      if (res.ok) {
        setItems(prev => prev.filter((_, i) => i !== index));
        toast.success('Image deleted');
      } else toast.error('Delete failed');
    } catch { toast.error('Delete failed'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-powered-portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags, items }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Saved ${data.count} images`);
      } else {
        toast.error(data.error || 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const en = newTagEn.trim();
    const tr = newTagTr.trim();
    if (!en || !tr) {
      toast.error('Enter both English and Turkish labels');
      return;
    }
    const baseId = deriveTagId(en);
    let id = baseId;
    let n = 2;
    while (tags.some((t) => t.id === id)) {
      id = `${baseId}-${n++}`;
    }
    setTags((prev) => [...prev, { id, en, tr }]);
    setNewTagEn('');
    setNewTagTr('');
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setItems((prev) => prev.map((item) => ({
      ...item,
      tagIds: item.tagIds.filter((tagId) => tagId !== id),
    })));
    setDefaultTagIds((prev) => prev.filter((tagId) => tagId !== id));
  };

  const toggleDefaultTag = (id: string) => {
    setDefaultTagIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id],
    );
  };

  const toggleItemTag = (index: number, tagId: string) => {
    setItems((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      const has = item.tagIds.includes(tagId);
      return {
        ...item,
        tagIds: has ? item.tagIds.filter((id) => id !== tagId) : [...item.tagIds, tagId],
      };
    }));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const onDragStart = (index: number) => {
    dragItem.current = index;
    setDragIndex(index);
  };

  const onDragEnter = (index: number) => {
    if (dragItem.current === null || dragItem.current === index) return;
    const next = [...items];
    const [moved] = next.splice(dragItem.current, 1);
    next.splice(index, 0, moved);
    dragItem.current = index;
    setItems(next);
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
          <div className="grid grid-cols-2 gap-2 mt-8">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-th-fg/[0.03] animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title={a.aiPoweredPortfolio.title}
      breadcrumb={{ href: '/admin/ai-powered', label: a.nav.aiPowered }}
      actions={
        <>
          <Link href="/ai-powered/portfolio" target="_blank" className="btn-editorial text-[10px]">
            {a.actions.viewPage}
          </Link>
          <AdminButton onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {a.actions.upload}
          </AdminButton>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
          <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? a.actions.saving : a.actions.saveOrder}
          </AdminButton>
        </>
      }
    >
      <p className="admin-muted text-xs mb-8">
        {formatAdmin(a.aiPoweredPortfolio.count, { count: items.length })}
      </p>

      <div className="mb-10 border border-th-fg/[0.08] p-5 md:p-6 space-y-5">
        <div>
          <span className="section-label">{a.aiPoweredPortfolio.tagsTitle}</span>
          <p className="admin-muted text-[10px] mt-2">{a.aiPoweredPortfolio.tagsHint}</p>
        </div>

        {tags.length > 0 ? (
          <ul className="space-y-2">
            {tags.map((tag) => (
              <li key={tag.id} className="flex flex-wrap items-center gap-3 text-xs border border-th-fg/[0.06] px-3 py-2">
                <span className="font-mono text-[10px] text-th-fg/40">{tag.id}</span>
                <span>{tag.en}</span>
                <span className="text-th-fg/30">/</span>
                <span>{tag.tr}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-auto text-red-400/70 hover:text-red-400 text-[10px] uppercase tracking-widest"
                >
                  {a.aiPoweredPortfolio.deleteTag}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-muted text-[10px]">{a.aiPoweredPortfolio.noTags}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <AdminFormField label={a.aiPoweredPortfolio.tagEn}>
            <AdminInput value={newTagEn} onChange={(e) => setNewTagEn(e.target.value)} placeholder="Car" />
          </AdminFormField>
          <AdminFormField label={a.aiPoweredPortfolio.tagTr}>
            <AdminInput value={newTagTr} onChange={(e) => setNewTagTr(e.target.value)} placeholder="Araba" />
          </AdminFormField>
          <AdminButton type="button" onClick={addTag}>{a.aiPoweredPortfolio.addTag}</AdminButton>
        </div>

        {tags.length > 0 && (
          <div>
            <span className="section-label text-[9px] opacity-70">{a.aiPoweredPortfolio.uploadTags}</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleDefaultTag(tag.id)}
                  className={`px-3 py-1.5 text-[10px] tracking-wide border transition-colors ${
                    defaultTagIds.includes(tag.id)
                      ? 'border-th-fg bg-th-fg text-th-bg'
                      : 'border-th-fg/20 text-th-fg/60 hover:border-th-fg/40'
                  }`}
                >
                  {tag.en} / {tag.tr}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
        onCancel={() => { abortRef.current = true; }}
      />

      {items.length === 0 ? (
        <div className="text-center py-20 border border-th-fg/[0.05]">
          <p className="admin-muted text-xs tracking-[0.4em] uppercase">{a.aiPoweredPortfolio.noImages}</p>
          <p className="admin-muted text-[10px] mt-2">{a.aiPoweredPortfolio.noImagesHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <div
              key={item.src}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`group relative aspect-[3/4] overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 border border-th-fg/[0.06] ${
                dragIndex === index ? 'opacity-40 scale-95 ring-1 ring-th-fg/30' : 'opacity-100'
              }`}
            >
              <Image
                src={item.src}
                alt={`AI portfolio ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized={shouldSkipOptimization(item.src)}
              />
              <div className="absolute top-1 left-1 bg-th-bg/70 px-1.5 py-0.5">
                <span className="text-th-fg/60 text-[9px] font-mono">{index + 1}</span>
              </div>
              <div className="absolute inset-0 bg-th-bg/90 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-2 overflow-y-auto">
                <div className="flex justify-end gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveImage(index, -1); }}
                    disabled={index === 0}
                    className="w-6 h-6 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/20 transition-colors disabled:opacity-20 text-xs"
                  >↑</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveImage(index, 1); }}
                    disabled={index === items.length - 1}
                    className="w-6 h-6 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/20 transition-colors disabled:opacity-20 text-xs"
                  >↓</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(item.src, index); }}
                    className="w-6 h-6 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/20 transition-colors text-xs"
                  >✕</button>
                </div>
                {tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-th-fg/40">{a.aiPoweredPortfolio.imageTags}</span>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleItemTag(index, tag.id); }}
                          className={`px-1.5 py-0.5 text-[8px] border ${
                            item.tagIds.includes(tag.id)
                              ? 'border-th-fg bg-th-fg text-th-bg'
                              : 'border-th-fg/25 text-th-fg/55'
                          }`}
                        >
                          {tag.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 flex justify-end">
          <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? a.actions.saving : a.actions.saveOrder}
          </AdminButton>
        </div>
      )}
    </AdminPageLayout>
  );
}

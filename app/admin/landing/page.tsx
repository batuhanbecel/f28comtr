'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminDropzone } from '@/components/admin/AdminDropzone';

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

export default function AdminLanding() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const abortRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/landing-images');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      toast.error('Failed to load landing images');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

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
      formData.append('type', 'landing');
      formData.append('photographerId', 'hero');
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setImages(prev => [...prev, data.url]);
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
    if (successCount > 0) toast.success(`${successCount} landing image${successCount > 1 ? 's' : ''} uploaded`);
  }, []);

  const handleDeleteImage = async (img: string, index: number) => {
    if (!confirm('Delete this landing image?')) return;
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: img, photographerId: 'hero', type: 'landing' }),
      });
      if (res.ok) {
        setImages(prev => prev.filter((_, i) => i !== index));
        toast.success('Image deleted');
      } else toast.error('Delete failed');
    } catch { toast.error('Delete failed'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/landing-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
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

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };

  const onDragStart = (index: number) => {
    dragItem.current = index;
    setDragIndex(index);
  };

  const onDragEnter = (index: number) => {
    dragOver.current = index;
    if (dragItem.current === null || dragItem.current === index) return;
    const next = [...images];
    const [moved] = next.splice(dragItem.current, 1);
    next.splice(index, 0, moved);
    dragItem.current = index;
    setImages(next);
  };

  const onDragEnd = () => {
    dragItem.current = null;
    dragOver.current = null;
    setDragIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 w-full max-w-4xl px-8">
          <div className="h-10 bg-th-fg/[0.03] animate-pulse w-48" />
          <div className="grid grid-cols-2 gap-2 mt-8">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-th-fg/[0.03] animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Hero Images"
      breadcrumb={{ href: '/admin', label: 'Dashboard' }}
      actions={
        <>
          <Link href="/" target="_blank" className="btn-editorial text-[10px]">
            View Page ↗
          </Link>
          <AdminButton onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            + Upload
          </AdminButton>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
          <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Order'}
          </AdminButton>
        </>
      }
    >
      <p className="text-th-fg/25 text-xs mb-8">
        {images.length} images — drag to reorder, hover for controls
      </p>

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
          hint="Drop landing images here"
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
                <button onClick={() => abortRef.current = true} className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest uppercase">Cancel</button>
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

        {images.length === 0 ? (
          <div className="text-center py-20 border border-th-fg/[0.05]">
            <p className="text-th-fg/20 text-xs tracking-[0.4em] uppercase">No landing images found</p>
            <p className="text-th-fg/10 text-xs mt-2">Drop images above or click Upload to add landing images</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div
                key={img}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className={`group relative aspect-video overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
                  dragIndex === index ? 'opacity-40 scale-95 ring-1 ring-th-fg/30' : 'opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Landing ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={shouldSkipOptimization(img)}
                />
                <div className="absolute top-1 left-1 bg-th-bg/70 px-1.5 py-0.5">
                  <span className="text-th-fg/60 text-[9px] font-mono">{index + 1}</span>
                </div>
                <div className="absolute inset-0 bg-th-bg/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5">
                  <div className="flex justify-end gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveImage(index, -1); }}
                      disabled={index === 0}
                      className="w-6 h-6 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/20 transition-colors disabled:opacity-20 text-xs"
                    >←</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveImage(index, 1); }}
                      disabled={index === images.length - 1}
                      className="w-6 h-6 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/20 transition-colors disabled:opacity-20 text-xs"
                    >→</button>
                  </div>
                  <div className="text-center">
                    <span className="text-th-fg/40 text-[9px] font-mono">{index + 1} / {images.length}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteImage(img, index); }}
                      className="w-6 h-6 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/20 transition-colors text-xs"
                    >✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {images.length > 2 && (
        <div className="mt-6 flex justify-end">
          <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Order'}
          </AdminButton>
        </div>
      )}
    </AdminPageLayout>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { shouldSkipOptimization } from '@/lib/blob';

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

export default function AdminPreviews() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const abortRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const showMsg = (msg: string, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/preview-images');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      showMsg('Failed to load preview images', true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const uploadFiles = useCallback(async (files: File[]) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'image/avif', 'image/heic', 'image/heif'];
    const imageFiles = files.filter(f => allowed.includes(f.type));
    if (imageFiles.length === 0) { showMsg('No valid image files', true); return; }
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
      formData.append('type', 'preview');
      formData.append('photographerId', 'preview');
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
    if (successCount > 0) showMsg(`${successCount} preview image${successCount > 1 ? 's' : ''} uploaded`);
  }, []);

  const handleDeleteImage = async (img: string, index: number) => {
    if (!confirm('Delete this preview image?')) return;
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: img, photographerId: 'preview', type: 'preview' }),
      });
      if (res.ok) {
        setImages(prev => prev.filter((_, i) => i !== index));
        showMsg('Image deleted');
      } else showMsg('Delete failed', true);
    } catch { showMsg('Delete failed', true); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/preview-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(`Saved ${data.count} images`);
      } else {
        showMsg(data.error || 'Save failed', true);
      }
    } catch {
      showMsg('Save failed', true);
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
          <div className="h-10 bg-white/[0.03] animate-pulse w-48" />
          <div className="grid grid-cols-3 gap-2 mt-8">
            {[...Array(9)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/[0.03] animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-[#080808]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/25 text-[10px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors">
            ← Dashboard
          </Link>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Previews</span>
        </div>
        <Link
          href="/portfolios"
          target="_blank"
          className="text-white/30 text-[10px] tracking-[0.25em] uppercase hover:text-white/60 transition-colors px-3 py-2 hover:bg-white/5"
        >
          View Page ↗
        </Link>
      </header>

      {message && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 backdrop-blur border text-sm tracking-wide shadow-2xl ${
          isError ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-white/10 border-white/20 text-white'
        }`}>
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Previews</p>
            <h1 className="text-3xl font-black tracking-tighter">PHOTOGRAPHER PREVIEWS</h1>
            <p className="text-white/25 text-xs mt-1">
              {images.length} images — drag to reorder, hover for controls
            </p>
            <p className="text-white/10 text-xs mt-1">
              These are used for photographer cards on the Portfolios page
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2.5 border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40"
            >
              + Upload
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={e => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length) uploadFiles(Array.from(e.dataTransfer.files)); }}
          className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver ? 'border-white/40 bg-white/[0.06]' : 'border-white/[0.08] hover:border-white/15'
          }`}
        >
          <p className="text-white/30 text-xs tracking-wide">Drop preview images here or click Upload</p>
        </div>

        {uploadQueue.length > 0 && (
          <div className="mb-6 border border-white/[0.08] rounded-lg divide-y divide-white/[0.05] max-h-48 overflow-y-auto">
            {isUploading && (
              <div className="px-4 py-2 flex justify-between items-center bg-white/[0.02]">
                <span className="text-white/40 text-[10px] tracking-widest uppercase">
                  Uploading {uploadQueue.filter(q => q.status === 'done').length}/{uploadQueue.length}
                </span>
                <button onClick={() => abortRef.current = true} className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest uppercase">Cancel</button>
              </div>
            )}
            {uploadQueue.map((item, i) => (
              <div key={i} className="px-4 py-2 flex items-center justify-between text-xs">
                <span className="text-white/50 truncate max-w-[60%]">{item.fileName}</span>
                <span className={`text-[10px] tracking-wider ${
                  item.status === 'done' ? 'text-green-400/70' : item.status === 'error' ? 'text-red-400/70' : item.status === 'uploading' ? 'text-white/50' : 'text-white/20'
                }`}>
                  {item.status === 'uploading' ? 'Uploading...' : item.status === 'done' ? '✓' : item.status === 'error' ? item.error || 'Failed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.05]">
            <p className="text-white/20 text-xs tracking-[0.4em] uppercase">No preview images found</p>
            <p className="text-white/10 text-xs mt-2">Drop images above or click Upload to add preview images</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className={`group relative aspect-[3/4] overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 rounded-lg ${
                  dragIndex === index ? 'opacity-40 scale-95 ring-1 ring-white/30' : 'opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized={shouldSkipOptimization(img)}
                />
                <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5">
                  <span className="text-white/60 text-[9px] font-mono">{index + 1}</span>
                </div>
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5">
                  <div className="flex justify-end gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveImage(index, -1); }}
                      disabled={index === 0}
                      className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-20 text-xs"
                    >←</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveImage(index, 1); }}
                      disabled={index === images.length - 1}
                      className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-20 text-xs"
                    >→</button>
                  </div>
                  <div className="text-center">
                    <span className="text-white/40 text-[9px] font-mono">{index + 1} / {images.length}</span>
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

        {images.length > 3 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

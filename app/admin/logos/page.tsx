'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { shouldSkipOptimization } from '@/lib/blob';

interface LogoCategory {
  key: string;
  name: string;
  description: string;
  images: string[];
}

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

export default function AdminLogos() {
  const router = useRouter();
  const [categories, setCategories] = useState<LogoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('logos_clients');
  const [saving, setSaving] = useState(false);
  const abortRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (msg: string, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchLogos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/logos');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      showMsg('Failed to load logos', true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchLogos(); }, [fetchLogos]);

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
      formData.append('type', selectedCategory);
      formData.append('photographerId', 'logo');
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setCategories(prev => prev.map(cat => 
            cat.key === selectedCategory 
              ? { ...cat, images: [...cat.images, data.url] }
              : cat
          ));
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
    if (successCount > 0) showMsg(`${successCount} logo${successCount > 1 ? 's' : ''} uploaded`);
  }, [selectedCategory]);

  const handleDeleteLogo = async (categoryKey: string, logoUrl: string, index: number) => {
    if (!confirm('Delete this logo?')) return;
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: logoUrl, photographerId: 'logo', type: categoryKey }),
      });
      if (res.ok) {
        setCategories(prev => prev.map(cat => 
          cat.key === categoryKey 
            ? { ...cat, images: cat.images.filter((_, i) => i !== index) }
            : cat
        ));
        showMsg('Logo deleted');
      } else showMsg('Delete failed', true);
    } catch { showMsg('Delete failed', true); }
  };

  const moveLogo = (categoryKey: string, index: number, direction: -1 | 1) => {
    setCategories(prev => prev.map(cat => {
      if (cat.key !== categoryKey) return cat;
      const target = index + direction;
      if (target < 0 || target >= cat.images.length) return cat;
      const next = [...cat.images];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...cat, images: next };
    }));
  };

  const handleSaveOrder = async () => {
    if (!currentCategory) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/logos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryKey: selectedCategory, images: currentCategory.images }),
      });
      const data = await res.json();
      if (res.ok) showMsg(`Saved ${data.count} logos`);
      else showMsg(data.error || 'Save failed', true);
    } catch { showMsg('Save failed', true); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 w-full max-w-4xl px-8">
          <div className="h-10 bg-th-fg/[0.03] animate-pulse w-48" />
          <div className="grid grid-cols-4 gap-2 mt-8">
            {[...Array(12)].map((_, i) => <div key={i} className="aspect-square bg-th-fg/[0.03] animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find(c => c.key === selectedCategory);

  return (
    <div className="min-h-screen">
      <header className="border-b border-th-fg/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-th-surface/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase hover:text-th-fg/60 transition-colors">
            ← Dashboard
          </Link>
          <div className="w-px h-3 bg-th-fg/10" />
          <span className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase">Logos</span>
        </div>
        <Link
          href="/about"
          target="_blank"
          className="text-th-fg/30 text-[10px] tracking-[0.25em] uppercase hover:text-th-fg/60 transition-colors px-3 py-2 hover:bg-th-fg/5"
        >
          View Page ↗
        </Link>
      </header>

      {message && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 backdrop-blur border text-sm tracking-wide shadow-2xl ${
          isError ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-th-fg/10 border-th-fg/20 text-th-fg'
        }`}>
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-th-fg/20 text-[10px] tracking-[0.5em] uppercase mb-2">Logos</p>
          <h1 className="text-3xl font-black tracking-tighter">BRAND & AGENCY LOGOS</h1>
          <p className="text-th-fg/25 text-xs mt-1">
            Manage client, partner, f28, and social media logos
          </p>
        </div>

        {/* Category selector */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-th-fg text-th-bg'
                  : 'border border-th-fg/[0.15] text-th-fg/60 hover:text-th-fg hover:border-th-fg/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {currentCategory && (
          <>
            <div className="mb-4">
              <p className="text-th-fg/40 text-sm">{currentCategory.description}</p>
              <p className="text-th-fg/20 text-xs mt-1">
                {currentCategory.images.length} logo{currentCategory.images.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="mb-6 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2.5 border border-th-fg/[0.15] text-th-fg/60 hover:text-th-fg hover:border-th-fg/30 transition-colors disabled:opacity-40"
              >
                + Upload
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
              <button
                onClick={handleSaveOrder}
                disabled={saving || currentCategory.images.length === 0}
                className="bg-th-fg text-th-bg text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-th-fg/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Order'}
              </button>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length) uploadFiles(Array.from(e.dataTransfer.files)); }}
              className={`mb-6 border-2 border-dashed p-6 text-center transition-colors ${
                isDragOver ? 'border-th-fg/40 bg-th-fg/[0.06]' : 'border-th-fg/[0.08] hover:border-th-fg/15'
              }`}
            >
              <p className="text-th-fg/30 text-xs tracking-wide">Drop {currentCategory.name} logos here or click Upload</p>
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

            {currentCategory.images.length === 0 ? (
              <div className="text-center py-20 border border-th-fg/[0.05]">
                <p className="text-th-fg/20 text-xs tracking-[0.4em] uppercase">No {currentCategory.name} logos found</p>
                <p className="text-th-fg/10 text-xs mt-2">Drop logos above or click Upload to add {currentCategory.name} logos</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {currentCategory.images.map((logo, index) => (
                  <div
                    key={logo}
                    className="group relative aspect-square overflow-hidden bg-th-fg/[0.03] border border-th-fg/[0.06] hover:border-th-fg/20 transition-all duration-300"
                  >
                    <Image
                      src={logo}
                      alt={`${currentCategory.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
                      unoptimized={shouldSkipOptimization(logo)}
                    />
                    <div className="absolute top-1 left-1 bg-th-bg/70 px-1.5 py-0.5">
                      <span className="text-th-fg/60 text-[9px] font-mono">{index + 1}</span>
                    </div>
                    <div className="absolute inset-0 bg-th-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                      <div className="flex justify-between items-start">
                        <span className="text-th-fg/30 text-[9px] tracking-widest uppercase">#{index + 1}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveLogo(currentCategory.key, index, -1)}
                            disabled={index === 0}
                            className="w-6 h-6 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/15 transition-colors disabled:opacity-20 text-sm"
                          >↑</button>
                          <button
                            onClick={() => moveLogo(currentCategory.key, index, 1)}
                            disabled={index === currentCategory.images.length - 1}
                            className="w-6 h-6 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/15 transition-colors disabled:opacity-20 text-sm"
                          >↓</button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteLogo(currentCategory.key, logo, index)}
                          className="w-6 h-6 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors text-xs"
                        >✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

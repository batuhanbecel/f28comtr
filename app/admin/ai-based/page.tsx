'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { shouldSkipOptimization } from '@/lib/blob';

export default function AdminAIBased() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
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
      const res = await fetch('/api/admin/ai-images');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      showMsg('Failed to load AI images', true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-images', {
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
          <div className="grid grid-cols-5 gap-2 mt-8">
            {[...Array(15)].map((_, i) => <div key={i} className="aspect-square bg-white/[0.03] animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-[#080808]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/25 text-[10px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors">
            ← Lineup
          </Link>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase">AI Based</span>
        </div>
        <Link
          href="/ai-based"
          target="_blank"
          className="text-white/30 text-[10px] tracking-[0.25em] uppercase hover:text-white/60 transition-colors px-3 py-2 hover:bg-white/5"
        >
          View Page ↗
        </Link>
      </header>

      {/* Toast */}
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
            <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">AI Based</p>
            <h1 className="text-3xl font-black tracking-tighter">IMAGE ORDER</h1>
            <p className="text-white/25 text-xs mt-1">
              {images.length} images — drag to reorder, hover for controls
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Order'}
          </button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.05]">
            <p className="text-white/20 text-xs tracking-[0.4em] uppercase">No AI images found</p>
            <p className="text-white/10 text-xs mt-2">Add images to /public/ai-images/ and rebuild</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
            {images.map((img, index) => (
              <div
                key={img}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className={`group relative aspect-square overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
                  dragIndex === index ? 'opacity-40 scale-95 ring-1 ring-white/30' : 'opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`AI ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
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
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                      className="w-6 h-6 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/20 transition-colors text-xs"
                    >✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 12 && (
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

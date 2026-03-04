'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Photographer } from '@/lib/data';

const INPUT_CLS = 'w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors';
const LABEL_CLS = 'text-[10px] tracking-widest uppercase text-white/25 block mb-1.5';

export default function EditPhotographer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({ fullName: '', title: '', preview: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingImages, setSavingImages] = useState(false);
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

  const fetchData = useCallback(async () => {
    try {
      const [pRes, iRes] = await Promise.all([
        fetch(`/api/admin/photographers/${id}`),
        fetch(`/api/admin/photographers/${id}/images`),
      ]);

      if (pRes.status === 401) { router.push('/admin/login'); return; }
      if (!pRes.ok) { showMsg('Photographer not found', true); return; }

      const p = await pRes.json();
      const imgs = await iRes.json();

      setPhotographer(p);
      setFormData({ fullName: p.fullName, title: p.title, preview: p.preview });
      setImages(imgs);
    } catch {
      showMsg('Failed to load data', true);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/photographers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setPhotographer(data);
        showMsg('Saved successfully');
      } else {
        showMsg(data.error || 'Save failed', true);
      }
    } catch {
      showMsg('Save failed', true);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveImages = async () => {
    setSavingImages(true);
    try {
      const res = await fetch(`/api/admin/photographers/${id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(`Image order saved (${data.count} images)`);
      } else {
        showMsg(data.error || 'Failed to save image order', true);
      }
    } catch {
      showMsg('Failed to save image order', true);
    } finally {
      setSavingImages(false);
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

  const setPreview = (url: string) => {
    setFormData(v => ({ ...v, preview: url }));
    showMsg('Preview image updated — click Save Info to apply');
  };

  // Drag and drop handlers
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

  if (!photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/20 text-xs tracking-[0.4em] uppercase mb-4">Photographer not found</p>
          <Link href="/admin" className="text-white/40 text-[10px] tracking-widest uppercase hover:text-white transition-colors">← Dashboard</Link>
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
          <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase">{photographer.fullName}</span>
        </div>
        <Link
          href={`/portfolio/${id}`}
          target="_blank"
          className="text-white/30 text-[10px] tracking-[0.25em] uppercase hover:text-white/60 transition-colors px-3 py-2 hover:bg-white/5"
        >
          View Portfolio ↗
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

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-14">

        {/* Info Form */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Photographer</p>
              <h1 className="text-3xl font-black tracking-tighter">{photographer.fullName}</h1>
            </div>
            <button
              form="info-form"
              type="submit"
              disabled={saving}
              className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Info'}
            </button>
          </div>

          <form id="info-form" onSubmit={handleSaveInfo}>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Full Name</label>
                <input
                  value={formData.fullName}
                  onChange={e => setFormData(v => ({ ...v, fullName: e.target.value.toUpperCase() }))}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Title</label>
                <input
                  value={formData.title}
                  onChange={e => setFormData(v => ({ ...v, title: e.target.value.toUpperCase() }))}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Preview Image Path</label>
                <div className="flex gap-2">
                  <input
                    value={formData.preview}
                    onChange={e => setFormData(v => ({ ...v, preview: e.target.value }))}
                    placeholder="/portfolios/previews/name.webp"
                    className={INPUT_CLS}
                  />
                  {formData.preview && (
                    <div className="relative w-11 h-11 flex-shrink-0 overflow-hidden border border-white/10">
                      <Image src={formData.preview} alt="Preview" fill className="object-cover" sizes="44px" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Gallery Image Order */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Portfolio</p>
              <h2 className="text-3xl font-black tracking-tighter">IMAGES</h2>
              <p className="text-white/25 text-xs mt-1">
                {images.length} images &mdash; drag to reorder, hover for controls
              </p>
            </div>
            <button
              onClick={handleSaveImages}
              disabled={savingImages}
              className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {savingImages ? 'Saving...' : 'Save Order'}
            </button>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-20 border border-white/[0.05]">
              <p className="text-white/20 text-xs tracking-[0.4em] uppercase">No images found</p>
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
                    dragIndex === index
                      ? 'opacity-40 scale-95 ring-1 ring-white/30'
                      : 'opacity-100'
                  }`}
                >
                  {/* Thumbnail */}
                  <Image
                    src={img}
                    alt={`${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
                  />

                  {/* Position number — always visible */}
                  <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5">
                    <span className="text-white/60 text-[9px] font-mono">{index + 1}</span>
                  </div>

                  {/* Hover overlay with controls */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5">
                    {/* Top row: move + set preview */}
                    <div className="flex justify-between gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreview(img); }}
                        className={`w-6 h-6 flex items-center justify-center transition-colors text-[9px] ${
                          formData.preview === img
                            ? 'text-white bg-white/20'
                            : 'text-white/30 hover:text-yellow-300 hover:bg-yellow-300/10'
                        }`}
                        title="Set as preview"
                      >★</button>
                      <div className="flex gap-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveImage(index, -1); }}
                          disabled={index === 0}
                          className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-20 text-xs"
                          title="Move left"
                        >←</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveImage(index, 1); }}
                          disabled={index === images.length - 1}
                          className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-20 text-xs"
                          title="Move right"
                        >→</button>
                      </div>
                    </div>

                    {/* Center: position */}
                    <div className="text-center">
                      <span className="text-white/40 text-[9px] font-mono">{index + 1} / {images.length}</span>
                    </div>

                    {/* Bottom: remove */}
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="w-6 h-6 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/20 transition-colors text-xs"
                        title="Remove"
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
                onClick={handleSaveImages}
                disabled={savingImages}
                className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {savingImages ? 'Saving...' : 'Save Order'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

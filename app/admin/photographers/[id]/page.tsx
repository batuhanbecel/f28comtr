'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Photographer } from '@/lib/data';

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
        <div className="text-white/30 text-xs tracking-widest uppercase">Loading...</div>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-sm mb-4">Photographer not found</p>
          <Link href="/admin" className="text-white/50 text-xs tracking-widest uppercase hover:text-white">← Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#080808] z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/30 text-xs tracking-widest uppercase hover:text-white/70 transition-colors">
            ← Dashboard
          </Link>
          <span className="text-white/10">|</span>
          <span className="text-white/50 text-xs tracking-widest uppercase">{photographer.fullName}</span>
        </div>
        <Link href={`/portfolio/${id}`} target="_blank" className="text-white/30 text-xs tracking-widest uppercase hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5">
          View Portfolio
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Status message */}
        {message && (
          <div className={`px-4 py-3 border text-sm ${isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/80'}`}>
            {message}
          </div>
        )}

        {/* Info Form */}
        <section>
          <div className="mb-6">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-1">Photographer Info</p>
            <h2 className="text-xl font-black tracking-tight">{photographer.fullName}</h2>
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">Full Name</label>
                <input
                  value={formData.fullName}
                  onChange={e => setFormData(v => ({ ...v, fullName: e.target.value.toUpperCase() }))}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">Title</label>
                <input
                  value={formData.title}
                  onChange={e => setFormData(v => ({ ...v, title: e.target.value.toUpperCase() }))}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">Preview Image Path</label>
              <div className="flex gap-3 items-center">
                <input
                  value={formData.preview}
                  onChange={e => setFormData(v => ({ ...v, preview: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="/portfolios/previews/name.webp"
                />
                {formData.preview && (
                  <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden border border-white/10">
                    <Image src={formData.preview} alt="Preview" fill className="object-cover" sizes="48px" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Info'}
            </button>
          </form>
        </section>

        {/* Image Order */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-1">Image Order</p>
              <h2 className="text-xl font-black tracking-tight">PORTFOLIO IMAGES</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs">{images.length} images</span>
              <button
                onClick={handleSaveImages}
                disabled={savingImages}
                className="bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {savingImages ? 'Saving...' : 'Save Order'}
              </button>
            </div>
          </div>

          <p className="text-white/20 text-xs tracking-wide mb-4">Drag rows to reorder • Use arrows for precise control</p>

          <div className="space-y-1">
            {images.map((img, index) => {
              const filename = img.split('/').pop() || img;
              return (
                <div
                  key={img}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragEnter={() => onDragEnter(index)}
                  onDragEnd={onDragEnd}
                  onDragOver={e => e.preventDefault()}
                  className={`flex items-center gap-3 p-3 border transition-colors cursor-grab active:cursor-grabbing select-none ${
                    dragIndex === index
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  {/* Drag handle */}
                  <div className="text-white/20 text-sm font-mono w-4 flex-shrink-0 cursor-grab">⠿</div>

                  {/* Index */}
                  <span className="text-white/20 text-xs font-mono w-6 text-right flex-shrink-0">{index + 1}</span>

                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden bg-white/5">
                    <Image src={img} alt={filename} fill className="object-cover" sizes="40px" />
                  </div>

                  {/* Filename */}
                  <span className="text-white/60 text-xs font-mono flex-1 truncate">{filename}</span>

                  {/* Controls */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-white/30 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 text-xs"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="p-1.5 text-white/30 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 text-xs"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-colors text-xs ml-1"
                      title="Remove from list"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {images.length === 0 && (
            <div className="text-center py-10 border border-white/5 text-white/20 text-sm">
              No images found in this portfolio folder
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveImages}
                disabled={savingImages}
                className="bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import type { Photographer } from '@/lib/data';

const INPUT = 'w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors rounded';
const LABEL = 'text-[10px] tracking-widest uppercase text-white/25 block mb-1.5';

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newP, setNewP] = useState({ id: '', fullName: '', title: 'PHOTOGRAPHER', preview: '' });
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photographers');
      if (res.status === 401) { router.push('/admin/login'); return; }
      setPhotographers(await res.json());
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const movePhotographer = async (index: number, direction: -1 | 1) => {
    const next = [...photographers];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setPhotographers(next);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map(p => p.id) }),
      });
      if (!res.ok) { toast.error('Failed to save order'); load(); }
    } catch { toast.error('Failed to save order'); load(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/photographers/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success(`${name} deleted`); setPhotographers(p => p.filter(x => x.id !== id)); }
      else toast.error('Delete failed');
    } catch { toast.error('Delete failed'); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/photographers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newP, preview: newP.preview || `/portfolios/previews/${newP.id}.webp` }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${newP.fullName} added`);
        setPhotographers(p => [...p, data]);
        setNewP({ id: '', fullName: '', title: 'PHOTOGRAPHER', preview: '' });
        setShowAddForm(false);
      } else toast.error(data.error || 'Failed');
    } catch { toast.error('Failed to add'); }
  };


  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/25 text-[10px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors">
            ← Dashboard
          </Link>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Photographers</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddForm(v => !v)}
            className={`text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2 transition-colors rounded ${
              showAddForm ? 'bg-white/10 border border-white/20' : 'bg-white text-black hover:bg-white/90'
            }`}>
            {showAddForm ? '✕ Cancel' : '+ Add'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Admin / Photographers</p>
          <h1 className="text-3xl font-black tracking-tighter">LINEUP</h1>
          <p className="text-white/25 text-xs mt-1">{photographers.length} photographers — hover to edit or reorder</p>
        </div>

        {showAddForm && (
          <form onSubmit={handleAdd} className="mb-10 p-6 border border-white/[0.07] bg-white/[0.02] space-y-4 rounded-lg">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">New Photographer</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>ID / Folder</label>
                <input required placeholder="john-doe" value={newP.id}
                  onChange={e => setNewP(v => ({ ...v, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Full Name</label>
                <input required placeholder="JOHN DOE" value={newP.fullName}
                  onChange={e => setNewP(v => ({ ...v, fullName: e.target.value.toUpperCase() }))}
                  className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Title</label>
                <input required placeholder="PHOTOGRAPHER" value={newP.title}
                  onChange={e => setNewP(v => ({ ...v, title: e.target.value.toUpperCase() }))}
                  className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Preview Path (optional)</label>
                <input placeholder="/portfolios/previews/name.webp" value={newP.preview}
                  onChange={e => setNewP(v => ({ ...v, preview: e.target.value }))}
                  className={INPUT} />
              </div>
            </div>
            <button type="submit" className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors rounded">
              Create Photographer
            </button>
          </form>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/[0.03] animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photographers.map((p, index) => (
              <div key={p.id} className="group relative aspect-[3/4] overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all duration-300 rounded-lg">
                <Image src={p.preview} alt={p.fullName} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  unoptimized={shouldSkipOptimization(p.preview)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-1">{p.title}</p>
                  <p className="text-white font-bold text-sm tracking-tight">{p.fullName}</p>
                </div>
                <div className="absolute top-3 left-3 w-6 h-6 bg-black/60 backdrop-blur-sm rounded flex items-center justify-center">
                  <span className="text-white/50 text-[10px] font-mono">{index + 1}</span>
                </div>
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-white/30 text-[9px] tracking-widest uppercase">#{index + 1}</span>
                    <div className="flex gap-1">
                      <button onClick={() => movePhotographer(index, -1)} disabled={index === 0 || saving}
                        className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-20 text-sm rounded">↑</button>
                      <button onClick={() => movePhotographer(index, 1)} disabled={index === photographers.length - 1 || saving}
                        className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-20 text-sm rounded">↓</button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-sm tracking-tight">{p.fullName}</p>
                    <p className="text-white/40 text-[9px] tracking-widest mt-1">{p.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/photographers/${p.id}`}
                      className="flex-1 py-2 text-center text-[9px] font-bold tracking-[0.2em] uppercase bg-white text-black hover:bg-white/90 transition-colors rounded">
                      Edit Photos
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.fullName)}
                      className="px-3 py-2 text-[9px] tracking-widest uppercase text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors border border-red-400/20 rounded">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && photographers.length === 0 && (
          <div className="text-center py-24 border border-white/[0.05] rounded-lg">
            <p className="text-white/20 text-xs tracking-[0.4em] uppercase mb-6">No photographers found</p>
            <button onClick={() => setShowAddForm(true)}
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-5 py-2.5 transition-colors rounded">
              + Add Photographer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

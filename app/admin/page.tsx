'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Photographer } from '@/lib/data';

export default function AdminDashboard() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhotographer, setNewPhotographer] = useState({ id: '', fullName: '', title: 'PHOTOGRAPHER', preview: '' });
  const router = useRouter();

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchPhotographers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photographers');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setPhotographers(data);
    } catch {
      showMsg('Failed to load photographers');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchPhotographers(); }, [fetchPhotographers]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleSeed = async () => {
    if (!confirm('This will overwrite current data in Redis with the static defaults. Continue?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showMsg(`Seeded ${data.photographers} photographers and ${data.imageSets} image sets`);
        fetchPhotographers();
      } else {
        showMsg(data.error || 'Seed failed');
      }
    } catch {
      showMsg('Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const movePhotographer = async (index: number, direction: -1 | 1) => {
    const newList = [...photographers];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setPhotographers(newList);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newList.map(p => p.id) }),
      });
      if (!res.ok) { showMsg('Failed to save order'); fetchPhotographers(); }
    } catch {
      showMsg('Failed to save order');
      fetchPhotographers();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/photographers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg(`${name} deleted`);
        setPhotographers(prev => prev.filter(p => p.id !== id));
      } else {
        showMsg('Delete failed');
      }
    } catch {
      showMsg('Delete failed');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/photographers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPhotographer,
          name: newPhotographer.fullName.split(' ')[0],
          folder: newPhotographer.id,
          preview: newPhotographer.preview || `/portfolios/previews/${newPhotographer.id}.webp`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(`${newPhotographer.fullName} added`);
        setPhotographers(prev => [...prev, data]);
        setNewPhotographer({ id: '', fullName: '', title: 'PHOTOGRAPHER', preview: '' });
        setShowAddForm(false);
      } else {
        showMsg(data.error || 'Failed to add');
      }
    } catch {
      showMsg('Failed to add photographer');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-[#080808]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-5">
          <Image src="/logos/f28/f28_white.png" alt="f/2.8" width={80} height={40} className="h-7 w-auto opacity-70" />
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] tracking-[0.4em] uppercase font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="text-white/30 text-[10px] tracking-[0.25em] uppercase hover:text-white/60 transition-colors px-3 py-2 hover:bg-white/5 rounded">
            View Site ↗
          </Link>
          <button onClick={handleLogout} className="text-white/30 text-[10px] tracking-[0.25em] uppercase hover:text-white/60 transition-colors px-3 py-2 hover:bg-white/5 rounded">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Status toast */}
        {message && (
          <div className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-white/10 backdrop-blur border border-white/20 text-white text-sm tracking-wide shadow-2xl">
            {message}
          </div>
        )}

        {/* Stats bar */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/[0.06] mb-10 bg-white/[0.03]">
            <div className="bg-[#080808] px-5 py-4">
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-1">Photographers</p>
              <p className="text-2xl font-black tracking-tighter">{photographers.length}</p>
            </div>
            <div className="bg-[#080808] px-5 py-4">
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-1">AI Images</p>
              <Link href="/admin/ai-based" className="block group">
                <p className="text-2xl font-black tracking-tighter group-hover:text-white/70 transition-colors">→</p>
              </Link>
            </div>
            <div className="bg-[#080808] px-5 py-4">
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-1">View Site</p>
              <Link href="/" target="_blank" className="block group">
                <p className="text-2xl font-black tracking-tighter group-hover:text-white/70 transition-colors">↗</p>
              </Link>
            </div>
            <div className="bg-[#080808] px-5 py-4">
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-1">Session</p>
              <button onClick={handleLogout} className="block group text-left">
                <p className="text-2xl font-black tracking-tighter group-hover:text-red-400/70 transition-colors text-white/40">✕</p>
              </button>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Production / Photographers</p>
            <h1 className="text-3xl font-black tracking-tighter">LINEUP</h1>
            <p className="text-white/30 text-xs mt-1">{photographers.length} photographers &mdash; drag cards to reorder display order</p>
            <Link
              href="/admin/ai-based"
              className="inline-flex items-center gap-2 mt-4 text-white/30 text-[10px] tracking-[0.3em] uppercase hover:text-white/70 border border-white/[0.07] hover:border-white/20 px-4 py-2 transition-colors"
            >
              AI Based Images →
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="text-white/30 text-[10px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors px-4 py-2.5 border border-white/[0.07] hover:border-white/15 disabled:opacity-30"
            >
              {seeding ? 'Seeding...' : 'Seed from Files'}
            </button>
            <button
              onClick={() => setShowAddForm(v => !v)}
              className={`text-[10px] font-semibold tracking-[0.3em] uppercase px-4 py-2.5 transition-colors ${
                showAddForm
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {showAddForm ? '✕ Cancel' : '+ New'}
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="mb-10 p-6 border border-white/[0.07] bg-white/[0.015] space-y-4">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-5">New Photographer</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">ID / Folder Name</label>
                <input
                  required
                  placeholder="e.g. john-doe"
                  value={newPhotographer.id}
                  onChange={e => setNewPhotographer(v => ({ ...v, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">Full Name</label>
                <input
                  required
                  placeholder="e.g. JOHN DOE"
                  value={newPhotographer.fullName}
                  onChange={e => setNewPhotographer(v => ({ ...v, fullName: e.target.value.toUpperCase() }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">Title</label>
                <input
                  required
                  placeholder="PHOTOGRAPHER"
                  value={newPhotographer.title}
                  onChange={e => setNewPhotographer(v => ({ ...v, title: e.target.value.toUpperCase() }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">Preview Path (optional)</label>
                <input
                  placeholder="/portfolios/previews/name.webp"
                  value={newPhotographer.preview}
                  onChange={e => setNewPhotographer(v => ({ ...v, preview: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
            </div>
            <button type="submit" className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors mt-2">
              Create Photographer
            </button>
          </form>
        )}

        {/* Photographer grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photographers.map((p, index) => (
              <div key={p.id} className="group relative aspect-[3/4] overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all duration-300">
                {/* Preview image */}
                <Image
                  src={p.preview}
                  alt={p.fullName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Gradient overlay always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-1">{p.title}</p>
                  <p className="text-white font-bold text-sm tracking-tight leading-tight">{p.fullName}</p>
                </div>

                {/* Position badge */}
                <div className="absolute top-3 left-3 w-6 h-6 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white/50 text-[10px] font-mono">{index + 1}</span>
                </div>

                {/* Hover actions overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  {/* Top: reorder controls */}
                  <div className="flex justify-between items-start">
                    <span className="text-white/30 text-[9px] tracking-widest uppercase"># {index + 1}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => movePhotographer(index, -1)}
                        disabled={index === 0 || saving}
                        className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-20 text-sm"
                      >↑</button>
                      <button
                        onClick={() => movePhotographer(index, 1)}
                        disabled={index === photographers.length - 1 || saving}
                        className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-20 text-sm"
                      >↓</button>
                    </div>
                  </div>

                  {/* Center: name */}
                  <div className="text-center">
                    <p className="text-white font-bold text-sm tracking-tight">{p.fullName}</p>
                    <p className="text-white/40 text-[9px] tracking-widest mt-1">{p.title}</p>
                  </div>

                  {/* Bottom: actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/photographers/${p.id}`}
                      className="flex-1 py-2 text-center text-[9px] font-semibold tracking-[0.2em] uppercase bg-white text-black hover:bg-white/90 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.fullName)}
                      className="px-3 py-2 text-[9px] tracking-widest uppercase text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors border border-red-400/20"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && photographers.length === 0 && (
          <div className="text-center py-24 border border-white/[0.05]">
            <p className="text-white/20 text-xs tracking-[0.4em] uppercase mb-6">No photographers found</p>
            <button
              onClick={handleSeed}
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-5 py-2.5 transition-colors"
            >
              Seed from Static Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

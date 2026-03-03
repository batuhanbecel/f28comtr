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
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#080808] z-10">
        <div className="flex items-center gap-6">
          <Image src="/logos/f28/f28_white.png" alt="f/2.8" width={80} height={40} className="h-7 w-auto opacity-80" />
          <span className="text-white/30 text-xs tracking-[0.25em] uppercase">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
            View Site
          </Link>
          <button onClick={handleLogout} className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Status message */}
        {message && (
          <div className="mb-6 px-4 py-3 bg-white/5 border border-white/10 text-white/80 text-sm">
            {message}
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-1">Manage</p>
            <h1 className="text-2xl font-black tracking-tight">PHOTOGRAPHERS</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors px-3 py-2 border border-white/10 hover:border-white/20 disabled:opacity-30"
            >
              {seeding ? 'Seeding...' : 'Seed from Files'}
            </button>
            <button
              onClick={() => setShowAddForm(v => !v)}
              className="bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 hover:bg-white/90 transition-colors"
            >
              + Add New
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="mb-8 p-6 border border-white/10 bg-white/[0.02] space-y-4">
            <h3 className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">New Photographer</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="ID (e.g. john-doe)"
                value={newPhotographer.id}
                onChange={e => setNewPhotographer(v => ({ ...v, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                className="bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              />
              <input
                required
                placeholder="Full Name (e.g. JOHN DOE)"
                value={newPhotographer.fullName}
                onChange={e => setNewPhotographer(v => ({ ...v, fullName: e.target.value.toUpperCase() }))}
                className="bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              />
              <input
                required
                placeholder="Title (e.g. PHOTOGRAPHER)"
                value={newPhotographer.title}
                onChange={e => setNewPhotographer(v => ({ ...v, title: e.target.value.toUpperCase() }))}
                className="bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              />
              <input
                placeholder="Preview image path (optional)"
                value={newPhotographer.preview}
                onChange={e => setNewPhotographer(v => ({ ...v, preview: e.target.value }))}
                className="bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 hover:bg-white/90 transition-colors">
                Create
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-white/40 text-xs tracking-widest uppercase px-4 py-2 border border-white/10 hover:border-white/20 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Photographer list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {photographers.map((p, index) => (
              <div key={p.id} className="flex items-center gap-4 p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                {/* Preview */}
                <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/5">
                  <Image src={p.preview} alt={p.fullName} fill className="object-cover" sizes="56px" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm tracking-tight truncate">{p.fullName}</p>
                  <p className="text-white/40 text-xs tracking-widest mt-0.5">{p.title}</p>
                </div>

                {/* Position badge */}
                <span className="text-white/20 text-xs font-mono w-6 text-center">{index + 1}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => movePhotographer(index, -1)}
                    disabled={index === 0 || saving}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => movePhotographer(index, 1)}
                    disabled={index === photographers.length - 1 || saving}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <Link
                    href={`/admin/photographers/${p.id}`}
                    className="px-3 py-1.5 text-white/40 text-xs tracking-widest uppercase hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.fullName)}
                    className="px-3 py-1.5 text-red-400/60 text-xs tracking-widest uppercase hover:text-red-400 hover:bg-red-400/10 transition-colors border border-red-400/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && photographers.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-sm tracking-widest uppercase mb-4">No photographers found</p>
            <button onClick={handleSeed} className="text-xs tracking-widest uppercase text-white/40 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 transition-colors">
              Seed from Static Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

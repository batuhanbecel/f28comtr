'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { shouldSkipOptimization } from '@/lib/blob';
import type { Photographer } from '@/lib/data';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminFormField, AdminInput } from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { useAdminT } from '@/hooks/useAdminT';
import { formatAdmin } from '@/lib/adminI18n';

export default function PhotographersPage() {
  const a = useAdminT();
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
      if (!res.ok) {
        toast.error(a.toast.loadFailed);
        return;
      }
      setPhotographers(await res.json());
    } catch { toast.error(a.toast.loadFailed); }
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
      if (!res.ok) { toast.error(a.toast.saveOrderFailed); load(); }
    } catch { toast.error(a.toast.saveOrderFailed); load(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(formatAdmin(a.photographers.deleteConfirm, { name }))) return;
    try {
      const res = await fetch(`/api/admin/photographers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(formatAdmin(a.photographers.deleted, { name }));
        setPhotographers((p) => p.filter((x) => x.id !== id));
      } else toast.error(a.toast.deleteFailed);
    } catch { toast.error(a.toast.deleteFailed); }
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
        toast.success(formatAdmin(a.photographers.added, { name: newP.fullName }));
        setPhotographers(p => [...p, data]);
        setNewP({ id: '', fullName: '', title: 'PHOTOGRAPHER', preview: '' });
        setShowAddForm(false);
      } else toast.error(data.error || a.toast.failed);
    } catch { toast.error(a.toast.addFailed); }
  };

  return (
    <AdminPageLayout
      title={a.photographers.title}
      breadcrumb={{ href: '/admin', label: a.nav.dashboard }}
      actions={
        <AdminButton
          variant={showAddForm ? 'ghost' : 'primary'}
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? a.actions.cancel : a.actions.add}
        </AdminButton>
      }
    >
      <p className="admin-muted text-xs mb-8">
        {formatAdmin(a.photographers.count, { count: photographers.length })}
      </p>

      {showAddForm && (
        <AdminPanel label={a.photographers.new} title={a.photographers.newTitle} className="mb-10">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <AdminFormField label={a.photographers.idFolder}>
                <AdminInput
                  required
                  placeholder="john-doe"
                  value={newP.id}
                  onChange={(e) => setNewP(v => ({ ...v, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                />
              </AdminFormField>
              <AdminFormField label={a.photographers.fullName}>
                <AdminInput
                  required
                  placeholder="JOHN DOE"
                  value={newP.fullName}
                  onChange={(e) => setNewP(v => ({ ...v, fullName: e.target.value.toUpperCase() }))}
                />
              </AdminFormField>
              <AdminFormField label={a.photographers.titleField}>
                <AdminInput
                  required
                  placeholder="PHOTOGRAPHER"
                  value={newP.title}
                  onChange={(e) => setNewP(v => ({ ...v, title: e.target.value.toUpperCase() }))}
                />
              </AdminFormField>
              <AdminFormField label={a.photographers.previewPath}>
                <AdminInput
                  placeholder="/portfolios/previews/name.webp"
                  value={newP.preview}
                  onChange={(e) => setNewP(v => ({ ...v, preview: e.target.value }))}
                />
              </AdminFormField>
            </div>
            <AdminButton type="submit" variant="primary">
              {a.actions.createPhotographer}
            </AdminButton>
          </form>
        </AdminPanel>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-th-fg/[0.03] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photographers.map((p, index) => (
            <div key={p.id} className="group relative aspect-[3/4] overflow-hidden bg-th-fg/[0.03] border border-th-fg/[0.06] hover:border-th-fg/20 transition-all duration-300">
              <Image src={p.preview} alt={p.fullName} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                unoptimized={shouldSkipOptimization(p.preview)} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.9)] via-[rgb(var(--c-bg)/0.2)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-th-fg/40 text-[9px] tracking-[0.3em] uppercase mb-1">{p.title}</p>
                <p className="text-th-fg font-bold text-sm tracking-tight">{p.fullName}</p>
              </div>
              <div className="absolute top-3 left-3 w-6 h-6 bg-th-bg/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-th-fg/50 text-[10px] font-mono">{index + 1}</span>
              </div>
              <div className="absolute inset-0 bg-th-bg/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <span className="text-th-fg/30 text-[9px] tracking-widest uppercase">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button onClick={() => movePhotographer(index, -1)} disabled={index === 0 || saving}
                      className="w-7 h-7 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/15 transition-colors disabled:opacity-20 text-sm">↑</button>
                    <button onClick={() => movePhotographer(index, 1)} disabled={index === photographers.length - 1 || saving}
                      className="w-7 h-7 flex items-center justify-center text-th-fg/50 hover:text-th-fg hover:bg-th-fg/15 transition-colors disabled:opacity-20 text-sm">↓</button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-th-fg font-bold text-sm tracking-tight">{p.fullName}</p>
                  <p className="text-th-fg/40 text-[9px] tracking-widest mt-1">{p.title}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/photographers/${p.id}`}
                    className="flex-1 py-2 text-center text-[9px] font-bold tracking-[0.2em] uppercase bg-th-fg text-th-bg hover:bg-th-fg/90 transition-colors">
                    {a.actions.editPhotos}
                  </Link>
                  <button onClick={() => handleDelete(p.id, p.fullName)}
                    className="px-3 py-2 text-[9px] tracking-widest uppercase text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors border border-red-400/20">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && photographers.length === 0 && (
        <AdminPanel className="text-center py-16">
          <p className="admin-muted text-xs tracking-[0.4em] uppercase mb-6">{a.photographers.noResults}</p>
          <AdminButton onClick={() => setShowAddForm(true)}>{a.actions.addPhotographer}</AdminButton>
        </AdminPanel>
      )}
    </AdminPageLayout>
  );
}

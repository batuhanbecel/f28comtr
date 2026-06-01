'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminFormField, AdminInput } from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { useAdminT } from '@/hooks/useAdminT';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const a = useAdminT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || a.login.loginFailed);
      }
    } catch {
      setError(a.login.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageLayout title={a.login.title} maxWidth="4xl">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={100}
            height={50}
            className="h-10 w-auto mx-auto mb-6 opacity-90 invert dark:invert-0"
            loading="eager"
          />
          <p className="section-label section-label--mini mx-auto">{a.login.subtitle}</p>
        </div>

        <AdminPanel>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminFormField label={a.login.password}>
              <AdminInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={a.login.passwordPlaceholder}
                autoFocus
                required
              />
            </AdminFormField>

            {error ? <p className="text-red-400 text-xs tracking-wide">{error}</p> : null}

            <AdminButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full disabled:opacity-50"
            >
              {loading ? a.actions.signingIn : a.actions.signIn}
            </AdminButton>
          </form>
        </AdminPanel>
      </div>
    </AdminPageLayout>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={100}
            height={50}
            className="h-10 w-auto mx-auto mb-8 opacity-90"
          />
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase py-3 hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

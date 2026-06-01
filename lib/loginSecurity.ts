import { getRedis } from '@/lib/redis';

/**
 * Constant-time string comparison. Both inputs are hashed to a fixed-length
 * digest first, so neither the length nor the content leaks via timing.
 */
export async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

// ── Rate limit configuration ──────────────────────────────────────────────
const SHORT_WINDOW = 60; // seconds
const SHORT_MAX = 10; // attempts per short window before a strike
const LONG_WINDOW = 15 * 60; // seconds — escalated lockout duration
const STRIKE_WINDOW = 30 * 60; // seconds — window over which strikes accumulate
const STRIKES_TO_BLOCK = 3; // strikes within STRIKE_WINDOW → long block

interface RateResult {
  allowed: boolean;
  retryAfter?: number; // seconds
}

// ── In-memory fallback (per-instance) when Redis is not configured ─────────
interface MemEntry {
  count: number;
  windowReset: number;
  strikes: number;
  strikeReset: number;
  blockedUntil: number;
}
const memStore = new Map<string, MemEntry>();

function memConsume(ip: string): RateResult {
  const now = Date.now();
  let e = memStore.get(ip);
  if (!e) {
    e = { count: 0, windowReset: 0, strikes: 0, strikeReset: 0, blockedUntil: 0 };
    memStore.set(ip, e);
  }

  if (e.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((e.blockedUntil - now) / 1000) };
  }

  if (e.windowReset < now) {
    e.count = 0;
    e.windowReset = now + SHORT_WINDOW * 1000;
  }
  if (e.strikeReset < now) {
    e.strikes = 0;
    e.strikeReset = now + STRIKE_WINDOW * 1000;
  }

  e.count += 1;
  if (e.count > SHORT_MAX) {
    e.strikes += 1;
    if (e.strikes >= STRIKES_TO_BLOCK) {
      e.blockedUntil = now + LONG_WINDOW * 1000;
      return { allowed: false, retryAfter: LONG_WINDOW };
    }
    return { allowed: false, retryAfter: Math.ceil((e.windowReset - now) / 1000) };
  }
  return { allowed: true };
}

function memClear(ip: string) {
  const e = memStore.get(ip);
  if (e) {
    e.count = 0;
    e.windowReset = 0;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
/**
 * Records a login attempt and returns whether it is allowed. Uses Redis when
 * configured (shared across instances), otherwise an in-memory fallback so the
 * limiter never fails open.
 */
export async function consumeLoginAttempt(ip: string): Promise<RateResult> {
  const redis = getRedis();
  if (!redis) return memConsume(ip);

  const shortKey = `ratelimit:login:${ip}`;
  const strikeKey = `ratelimit:login:strikes:${ip}`;
  const blockKey = `ratelimit:login:block:${ip}`;

  const blockTtl = await redis.ttl(blockKey);
  if (blockTtl && blockTtl > 0) {
    return { allowed: false, retryAfter: blockTtl };
  }

  const count = await redis.incr(shortKey);
  if (count === 1) await redis.expire(shortKey, SHORT_WINDOW);

  if (count > SHORT_MAX) {
    const strikes = await redis.incr(strikeKey);
    if (strikes === 1) await redis.expire(strikeKey, STRIKE_WINDOW);
    if (strikes >= STRIKES_TO_BLOCK) {
      await redis.set(blockKey, '1', { ex: LONG_WINDOW });
      return { allowed: false, retryAfter: LONG_WINDOW };
    }
    const ttl = await redis.ttl(shortKey);
    return { allowed: false, retryAfter: ttl > 0 ? ttl : SHORT_WINDOW };
  }

  return { allowed: true };
}

/** Clears the short-window counter after a successful login. */
export async function clearLoginAttempts(ip: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memClear(ip);
    return;
  }
  await redis.del(`ratelimit:login:${ip}`);
}

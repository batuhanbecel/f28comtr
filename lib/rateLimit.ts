/**
 * In-memory sliding-window rate limiter for serverless route handlers.
 * Prevents SMTP quota exhaustion and spam on public endpoints like /api/contact.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale records periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs?: number; // Time frame in ms (default: 1 minute)
  max?: number;      // Max allowed requests in time frame (default: 5)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks whether an IP or identifier has exceeded the allowed rate limit.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const windowMs = options.windowMs ?? 60 * 1000; // 1 minute
  const max = options.max ?? 5;                   // 5 requests per window
  const now = Date.now();

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // New or expired window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(identifier, newRecord);
    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset: newRecord.resetAt,
    };
  }

  if (record.count >= max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: max,
    remaining: max - record.count,
    reset: record.resetAt,
  };
}

/**
 * Helper to extract client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

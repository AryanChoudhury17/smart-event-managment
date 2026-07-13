/**
 * @fileoverview Rate limiting middleware using in-memory store
 * @module lib/rate-limit
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/** In-memory rate limit store (use Redis in production) */
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Rate limiter utility for API routes.
 * Uses sliding window algorithm with in-memory store.
 * Replace with Redis-backed store for production multi-instance deployments.
 *
 * @param identifier - Unique key (IP address, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns Rate limit result with remaining quota
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {
    limit: parseInt(process.env.RATE_LIMIT_RPM ?? "60"),
    windowMs: 60 * 1000,
  },
): RateLimitResult {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    for (const [k, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt < now) {
    // Start new window
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetAt: entry.resetAt,
    };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Gets the client IP from Next.js request headers
 * @param headers - Request headers
 * @returns IP address string
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    return first?.trim() ?? "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}

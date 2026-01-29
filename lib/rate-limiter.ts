interface UsageRecord {
  timestamp: number; // milliseconds since epoch
  endpoint: string;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

class RateLimiter {
  private usage: Map<string, UsageRecord[]> = new Map();

  // Check if user is within rate limit
  async checkLimit(
    userId: string,
    endpoint: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get user's usage history
    let records = this.usage.get(key) || [];

    // Remove expired records (sliding window)
    records = records.filter(r => r.timestamp > windowStart);

    // Update storage with cleaned records
    this.usage.set(key, records);

    // Check if within limit
    const allowed = records.length < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - records.length);
    const resetAt = records.length > 0
      ? records[0].timestamp + config.windowMs
      : now + config.windowMs;

    return { allowed, remaining, resetAt };
  }

  // Record API usage
  async recordUsage(userId: string, endpoint: string): Promise<void> {
    const key = `${userId}:${endpoint}`;
    const records = this.usage.get(key) || [];
    records.push({ timestamp: Date.now(), endpoint });
    this.usage.set(key, records);
  }

  // Get usage stats for debugging
  getUsageStats(userId: string, endpoint: string): {
    requestsInWindow: number;
    oldestRequest: number | null;
  } {
    const key = `${userId}:${endpoint}`;
    const records = this.usage.get(key) || [];
    return {
      requestsInWindow: records.length,
      oldestRequest: records.length > 0 ? records[0].timestamp : null,
    };
  }
}

// Singleton instance
declare global {
  var __meetme_ratelimiter: RateLimiter | undefined;
}

export function getRateLimiter(): RateLimiter {
  if (!globalThis.__meetme_ratelimiter) {
    globalThis.__meetme_ratelimiter = new RateLimiter();
  }
  return globalThis.__meetme_ratelimiter;
}

// Rate limit configurations
export const RATE_LIMITS = {
  GOOGLE_PLACES: {
    maxRequests: 10,        // 10 requests per user
    windowMs: 86400000,     // 24 hours (1 day)
    message: 'Daily venue search limit reached. Please try again tomorrow.',
  },
  GIPHY_SEARCH: {
    maxRequests: 20,        // 20 requests per user
    windowMs: 3600000,      // 1 hour
    message: 'Image search limit reached. Please try again in an hour.',
  },
} as const;

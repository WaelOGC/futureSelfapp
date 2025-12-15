// Rate limiting middleware for AI provider calls

const { AppError } = require('../errors/error.handler');

// Default rate limit policy for AI calls
const AI_RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  maxRequests: 20
};

/**
 * Create a rate limiter instance
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Maximum requests per window
 * @returns {Object} Rate limiter instance with consume method
 */
function createRateLimiter({ windowMs, maxRequests }) {
  const requestHistory = new Map(); // identity -> array of timestamps

  /**
   * Consume a rate limit token for an identity
   * @param {string} identity - User/identity identifier
   * @throws {AppError} If rate limit exceeded (status 429, code RATE_LIMITED)
   */
  function consume(identity = 'local-dev') {
    const now = Date.now();
    const cutoff = now - windowMs;

    // Get or create request history for this identity
    if (!requestHistory.has(identity)) {
      requestHistory.set(identity, []);
    }

    const history = requestHistory.get(identity);

    // Remove old requests outside the window
    while (history.length > 0 && history[0] < cutoff) {
      history.shift();
    }

    // Check if limit exceeded
    if (history.length >= maxRequests) {
      // Calculate retry after time (oldest request + window - now)
      const oldestRequest = history[0];
      const retryAfterMs = (oldestRequest + windowMs) - now;

      throw new AppError(
        `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs}ms window.`,
        429,
        'RATE_LIMITED',
        {
          identity,
          maxRequests,
          windowMs,
          retryAfterMs: Math.max(0, retryAfterMs)
        }
      );
    }

    // Add current request timestamp
    history.push(now);
  }

  return {
    consume
  };
}

// Create default rate limiter instance
const defaultRateLimiter = createRateLimiter(AI_RATE_LIMIT);

module.exports = {
  createRateLimiter,
  defaultRateLimiter,
  AI_RATE_LIMIT
};

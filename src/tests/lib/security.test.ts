import { describe, it, expect, beforeEach } from "vitest";
import {
  addSecurityHeaders,
  RateLimiter,
  generateSecureToken,
  hashData,
  isValidOrigin,
} from "../../lib/security";

describe("Security Module", () => {
  describe("addSecurityHeaders function", () => {
    it("should add X-Content-Type-Options header", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should add X-Frame-Options header", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      expect(headers.get("X-Frame-Options")).toBe("DENY");
    });

    it("should add X-XSS-Protection header", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      expect(headers.get("X-XSS-Protection")).toContain("1");
    });

    it("should add Content-Security-Policy header", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      const csp = headers.get("Content-Security-Policy");
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src");
    });

    it("should add Referrer-Policy header", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    });

    it("should add Permissions-Policy header", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      const policy = headers.get("Permissions-Policy");
      expect(policy).toBeDefined();
    });

    it("should return headers object", () => {
      const headers = new Headers();
      const result = addSecurityHeaders(headers);

      expect(result).toBe(headers);
    });
  });

  describe("RateLimiter class", () => {
    let limiter: RateLimiter;

    beforeEach(() => {
      limiter = new RateLimiter(5, 1000); // 5 requests per 1000ms
    });

    it("should allow requests under limit", () => {
      for (let i = 0; i < 5; i++) {
        expect(limiter.isAllowed("test-ip")).toBe(true);
      }
    });

    it("should reject requests over limit", () => {
      for (let i = 0; i < 5; i++) {
        limiter.isAllowed("test-ip");
      }

      expect(limiter.isAllowed("test-ip")).toBe(false);
    });

    it("should track different IPs separately", () => {
      for (let i = 0; i < 5; i++) {
        limiter.isAllowed("ip1");
      }

      // Different IP should still have quota
      expect(limiter.isAllowed("ip2")).toBe(true);
    });

    it("should reset after window expires", async () => {
      const quickLimiter = new RateLimiter(1, 100);

      expect(quickLimiter.isAllowed("test")).toBe(true);
      expect(quickLimiter.isAllowed("test")).toBe(false);

      // Wait for window to reset
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(quickLimiter.isAllowed("test")).toBe(true);
    });

    it("should return remaining requests", () => {
      limiter.isAllowed("test-ip");
      expect(limiter.getRemainingRequests("test-ip")).toBe(4);

      limiter.isAllowed("test-ip");
      expect(limiter.getRemainingRequests("test-ip")).toBe(3);
    });

    it("should return reset time", () => {
      limiter.isAllowed("test-ip");
      const resetTime = limiter.getResetTime("test-ip");

      expect(resetTime).toBeGreaterThan(Date.now());
      expect(resetTime).toBeLessThanOrEqual(Date.now() + 1100);
    });
  });

  describe("generateSecureToken function", () => {
    it("should generate a token", () => {
      const token = generateSecureToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should generate unique tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).not.toBe(token2);
    });

    it("should generate tokens with proper length", () => {
      const token = generateSecureToken();

      // Base64 encoded 32 bytes should be ~43 characters
      expect(token.length).toBeGreaterThan(30);
      expect(token.length).toBeLessThan(100);
    });

    it("should generate URL-safe tokens", () => {
      const token = generateSecureToken();

      // Should be safe for URLs (no + or / characters outside proper base64)
      expect(token).toMatch(/^[A-Za-z0-9_-]+={0,2}$/);
    });
  });

  describe("hashData function", () => {
    it("should hash data consistently", async () => {
      const data = "test-data";
      const hash1 = await hashData(data);
      const hash2 = await hashData(data);

      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different data", async () => {
      const hash1 = await hashData("data1");
      const hash2 = await hashData("data2");

      expect(hash1).not.toBe(hash2);
    });

    it("should return a string hash", async () => {
      const hash = await hashData("test");

      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should be secure hash (lengthy output)", async () => {
      const hash = await hashData("test");

      // SHA-256 produces 64 character hex string
      expect(hash.length).toBeGreaterThanOrEqual(64);
    });
  });

  describe("isValidOrigin function", () => {
    it("should allow localhost in development", () => {
      expect(isValidOrigin("http://localhost:3000")).toBe(true);
    });

    it("should allow 127.0.0.1 in development", () => {
      expect(isValidOrigin("http://127.0.0.1:3000")).toBe(true);
    });

    it("should reject invalid origins", () => {
      expect(isValidOrigin("http://malicious.com")).toBe(false);
    });

    it("should handle URLs with different protocols", () => {
      expect(isValidOrigin("https://localhost:3000")).toBe(true);
    });

    it("should handle URLs without protocol", () => {
      const result = isValidOrigin("localhost:3000");

      expect(typeof result).toBe("boolean");
    });

    it("should be case-insensitive for localhost", () => {
      expect(isValidOrigin("http://LOCALHOST:3000")).toBe(true);
    });
  });

  describe("Integration scenarios", () => {
    it("should combine security headers with rate limiting", () => {
      const headers = new Headers();
      addSecurityHeaders(headers);

      const limiter = new RateLimiter(10, 60000);
      const allowed = limiter.isAllowed("test-ip");

      expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(allowed).toBe(true);
    });

    it("should generate and hash tokens", async () => {
      const token = generateSecureToken();
      const hash = await hashData(token);

      expect(token).toBeDefined();
      expect(hash).toBeDefined();
      expect(token).not.toBe(hash);
    });

    it("should validate origin and apply headers", () => {
      const isValid = isValidOrigin("http://localhost:3000");
      const headers = new Headers();

      if (isValid) {
        addSecurityHeaders(headers);
      }

      expect(isValid).toBe(true);
      expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    });
  });
});

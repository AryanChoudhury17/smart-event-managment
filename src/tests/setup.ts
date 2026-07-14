/**
 * @fileoverview Test setup and utilities
 * @module tests/setup
 */

import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }: Record<string, string>) => `<img src="${src}" alt="${alt}" />`,
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

// Add custom matchers if needed
declare module "vitest" {
  interface Assertion<T = any> {
    toBeValidEmail(): T;
    toBeValidUUID(): T;
  }
}

expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    return {
      pass,
      message: () => `expected ${received} to be a valid email`,
    };
  },
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);

    return {
      pass,
      message: () => `expected ${received} to be a valid UUID`,
    };
  },
});

export {};

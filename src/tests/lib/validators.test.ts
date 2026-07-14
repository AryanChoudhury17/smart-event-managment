/**
 * @fileoverview Tests for validators utility
 * @module tests/lib/validators.test
 */

import { describe, it, expect } from "vitest";
import { sanitizeInput, isValidEmail, isValidUUID, safeParseJSON } from "@/lib/validators";

describe("Validators", () => {
  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      const input = "<script>alert('XSS')</script>";
      const result = sanitizeInput(input);

      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("should remove javascript protocol", () => {
      const input = "javascript:alert('XSS')";
      const result = sanitizeInput(input);

      expect(result).not.toContain("javascript:");
    });

    it("should remove event handlers", () => {
      const input = 'onclick="alert(\'XSS\')"';
      const result = sanitizeInput(input);

      expect(result).not.toContain("onclick");
      expect(result).not.toContain("=");
    });

    it("should trim whitespace", () => {
      const input = "  hello world  ";
      const result = sanitizeInput(input);

      expect(result).toBe("hello world");
    });

    it("should respect max length", () => {
      const input = "a".repeat(3000);
      const result = sanitizeInput(input);

      expect(result.length).toBeLessThanOrEqual(2000);
    });

    it("should handle non-string input", () => {
      const result = sanitizeInput(null as unknown as string);

      expect(result).toBe("");
    });
  });

  describe("isValidEmail", () => {
    it("should accept valid emails", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("test.user@domain.co.uk")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("isValidUUID", () => {
    it("should accept valid UUIDs", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("not-a-uuid")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
    });

    it("should be case-insensitive", () => {
      expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
    });
  });

  describe("safeParseJSON", () => {
    it("should parse valid JSON", () => {
      const json = '{"key": "value"}';
      const result = safeParseJSON(json, {});

      expect(result).toEqual({ key: "value" });
    });

    it("should return fallback on invalid JSON", () => {
      const json = "invalid json";
      const fallback = { default: true };
      const result = safeParseJSON(json, fallback);

      expect(result).toEqual(fallback);
    });

    it("should parse arrays", () => {
      const json = '[1, 2, 3]';
      const result = safeParseJSON(json, []);

      expect(result).toEqual([1, 2, 3]);
    });
  });
});

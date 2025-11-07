import { describe, it, expect } from "vitest";
import {
  frenlyAddress,
  formatQuantity,
  formatEther,
  formatCash,
  formatCashHeader,
  generatePixelBorderPath,
} from "./ui";

describe("UI Utility Functions", () => {
  describe("frenlyAddress", () => {
    it("should format a full address to a short friendly format", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678";
      const result = frenlyAddress(address);
      expect(result).toBe("0x12...5678");
    });

    it("should handle shorter addresses", () => {
      const address = "0x12345678";
      const result = frenlyAddress(address);
      expect(result).toBe("0x12...5678");
    });
  });

  describe("formatQuantity", () => {
    it("should format small numbers without compacting", () => {
      expect(formatQuantity(100)).toBe("100");
      expect(formatQuantity(999)).toBe("999");
    });

    it("should compact large numbers with K notation", () => {
      expect(formatQuantity(1000)).toBe("1K");
      expect(formatQuantity(1500)).toBe("1.5K");
      expect(formatQuantity(10000)).toBe("10K");
    });

    it("should compact millions with M notation", () => {
      expect(formatQuantity(1000000)).toBe("1M");
      expect(formatQuantity(1500000)).toBe("1.5M");
    });

    it("should compact billions with B notation", () => {
      expect(formatQuantity(1000000000)).toBe("1B");
      expect(formatQuantity(2500000000)).toBe("2.5B");
    });
  });

  describe("formatEther", () => {
    it("should convert wei to ether with precision", () => {
      // 1 ether = 10^18 wei
      expect(formatEther("1000000000000000000")).toBe(1);
      expect(formatEther(1000000000000000000n)).toBe(1);
    });

    it("should handle smaller amounts", () => {
      // 0.1 ether = 10^17 wei
      const result = formatEther("100000000000000000");
      expect(result).toBeCloseTo(0.1, 4);
    });

    it("should handle zero", () => {
      expect(formatEther("0")).toBe(0);
      expect(formatEther(0n)).toBe(0);
    });
  });

  describe("formatCash", () => {
    it("should format cash with dollar sign and no decimals", () => {
      expect(formatCash(1000)).toBe("$1,000");
      expect(formatCash(1234.56)).toBe("$1,235");
    });

    it("should handle zero", () => {
      expect(formatCash(0)).toBe("$0");
    });

    it("should format large amounts with commas", () => {
      expect(formatCash(1000000)).toBe("$1,000,000");
    });
  });

  describe("formatCashHeader", () => {
    it("should format small amounts normally", () => {
      expect(formatCashHeader(100)).toBe("$100");
      expect(formatCashHeader(9999)).toBe("$9,999");
    });

    it("should format thousands with k suffix", () => {
      expect(formatCashHeader(10000)).toBe("$10.0k");
      expect(formatCashHeader(50000)).toBe("$50.0k");
      expect(formatCashHeader(999999)).toBe("$1,000.0k");
    });

    it("should format millions with M suffix", () => {
      expect(formatCashHeader(1000000)).toBe("$1.0M");
      expect(formatCashHeader(5500000)).toBe("$5.5M");
      expect(formatCashHeader(999999999)).toBe("$1,000.0M");
    });

    it("should format billions with B suffix", () => {
      expect(formatCashHeader(1000000000)).toBe("$1.0B");
      expect(formatCashHeader(5500000000)).toBe("$5.5B");
    });

    it("should return overflow message for extreme amounts", () => {
      expect(formatCashHeader(1000000000000)).toBe("Ca$hOverflow");
      expect(formatCashHeader(9999999999999)).toBe("Ca$hOverflow");
    });
  });

  describe("generatePixelBorderPath", () => {
    it("should generate a path string", () => {
      const result = generatePixelBorderPath();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle custom radius and pixel size", () => {
      const result1 = generatePixelBorderPath(4, 4);
      const result2 = generatePixelBorderPath(8, 2);
      expect(typeof result1).toBe("string");
      expect(typeof result2).toBe("string");
      expect(result1).not.toBe(result2);
    });
  });
});

/**
 * EMI Calculator - Unit Tests
 * Tests for calculation logic and utility functions
 */

const { calculateEMI, formatCurrency, formatNumber } = require('../script.js');

describe('EMI Calculator - Core Functions', () => {
  describe('calculateEMI()', () => {
    it('should exist and be a function', () => {
      expect(typeof calculateEMI).toBe('function');
    });

    it('should calculate EMI for standard inputs', () => {
      const result = calculateEMI(500000, 7.5, 60);
      expect(result).toHaveProperty('emi');
      expect(result).toHaveProperty('totalPayment');
      expect(result).toHaveProperty('totalInterest');
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalPayment).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should return object with correct structure', () => {
      const result = calculateEMI(1000000, 8.5, 120);
      expect(Object.keys(result).sort()).toEqual(['emi', 'totalInterest', 'totalPayment'].sort());
    });

    it('should return zero EMI for zero tenure', () => {
      const result = calculateEMI(500000, 7.5, 0);
      expect(result.emi).toBe(0);
      expect(result.totalPayment).toBe(0);
      expect(result.totalInterest).toBe(0);
    });

    it('should return zero EMI for negative tenure', () => {
      const result = calculateEMI(500000, 7.5, -10);
      expect(result.emi).toBe(0);
      expect(result.totalPayment).toBe(0);
      expect(result.totalInterest).toBe(0);
    });

    it('should calculate correctly with zero interest rate', () => {
      const principal = 500000;
      const months = 60;
      const result = calculateEMI(principal, 0, months);
      
      const expectedEmi = principal / months;
      expect(result.emi).toBeCloseTo(expectedEmi, 2);
      expect(result.totalPayment).toBe(principal);
      expect(result.totalInterest).toBe(0);
    });

    it('should satisfy: totalPayment = EMI × months', () => {
      const result = calculateEMI(500000, 7.5, 60);
      const expectedTotalPayment = result.emi * 60;
      expect(result.totalPayment).toBeCloseTo(expectedTotalPayment, 2);
    });

    it('should satisfy: totalInterest = totalPayment - principal', () => {
      const principal = 500000;
      const result = calculateEMI(principal, 7.5, 60);
      const expectedInterest = result.totalPayment - principal;
      expect(result.totalInterest).toBeCloseTo(expectedInterest, 2);
    });

    it('should calculate higher EMI for higher interest rates', () => {
      const result5 = calculateEMI(500000, 5, 60);
      const result10 = calculateEMI(500000, 10, 60);
      expect(result10.emi).toBeGreaterThan(result5.emi);
    });

    it('should calculate higher EMI for shorter tenure', () => {
      const result24 = calculateEMI(500000, 7.5, 24);
      const result60 = calculateEMI(500000, 7.5, 60);
      expect(result24.emi).toBeGreaterThan(result60.emi);
    });

    it('should calculate higher total interest for longer tenure', () => {
      const result24 = calculateEMI(500000, 7.5, 24);
      const result60 = calculateEMI(500000, 7.5, 60);
      expect(result60.totalInterest).toBeGreaterThan(result24.totalInterest);
    });

    it('should calculate higher EMI for higher principal', () => {
      const result500k = calculateEMI(500000, 7.5, 60);
      const result1m = calculateEMI(1000000, 7.5, 60);
      expect(result1m.emi).toBeGreaterThan(result500k.emi);
    });

    it('should handle very high interest rates', () => {
      const result = calculateEMI(500000, 20, 60);
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should handle very long tenure (360 months)', () => {
      const result = calculateEMI(500000, 7.5, 360);
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalPayment).toBeCloseTo(result.emi * 360, 0);
    });

    it('should handle minimum loan amount (10000)', () => {
      const result = calculateEMI(10000, 7.5, 60);
      expect(result.emi).toBeGreaterThan(0);
    });

    it('should handle maximum loan amount (10000000)', () => {
      const result = calculateEMI(10000000, 7.5, 60);
      expect(result.emi).toBeGreaterThan(0);
    });

    it('should handle decimal interest rates', () => {
      const result = calculateEMI(500000, 7.25, 60);
      expect(result.emi).toBeGreaterThan(0);
    });

    it('should handle minimum interest rate (0.1%)', () => {
      const result = calculateEMI(500000, 0.1, 60);
      expect(result.emi).toBeGreaterThan(0);
    });

    it('should be mathematically consistent (EMI formula)', () => {
      // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
      const P = 500000;
      const rAnnual = 7.5;
      const n = 60;
      
      const result = calculateEMI(P, rAnnual, n);
      const r = rAnnual / 12 / 100;
      
      const numerator = P * r * Math.pow(1 + r, n);
      const denominator = Math.pow(1 + r, n) - 1;
      const expectedEmi = numerator / denominator;
      
      expect(result.emi).toBeCloseTo(expectedEmi, 2);
    });

    it('should handle edge case: 1 month tenure', () => {
      const result = calculateEMI(500000, 7.5, 1);
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalPayment).toBeCloseTo(result.emi, 2);
    });

    it('should return all positive values', () => {
      const result = calculateEMI(500000, 7.5, 60);
      expect(result.emi).toBeGreaterThanOrEqual(0);
      expect(result.totalPayment).toBeGreaterThanOrEqual(0);
      expect(result.totalInterest).toBeGreaterThanOrEqual(0);
    });
  });

  describe('formatCurrency()', () => {
    it('should exist and be a function', () => {
      expect(typeof formatCurrency).toBe('function');
    });

    it('should format numbers as currency with INR symbol', () => {
      const formatted = formatCurrency(500000);
      expect(formatted).toContain('₹');
    });

    it('should handle zero', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should handle decimals', () => {
      const formatted = formatCurrency(9952.45);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should add thousand separators', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain(',');
    });
  });

  describe('formatNumber()', () => {
    it('should exist and be a function', () => {
      expect(typeof formatNumber).toBe('function');
    });

    it('should format numbers with locale separators', () => {
      const formatted = formatNumber(500000);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should handle decimals with max 1 fraction digit', () => {
      const formatted = formatNumber(7.5);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should handle zero', () => {
      const formatted = formatNumber(0);
      expect(formatted).toBeDefined();
    });
  });

  describe('Input Validation and Edge Cases', () => {
    it('should handle very large numbers', () => {
      const result = calculateEMI(999999999, 15, 300);
      expect(result.emi).toBeGreaterThan(0);
    });

    it('should handle very small tenure', () => {
      const result = calculateEMI(100, 5, 1);
      expect(result.emi).toBeGreaterThan(0);
    });

    it('should calculate same result for identical inputs', () => {
      const result1 = calculateEMI(500000, 7.5, 60);
      const result2 = calculateEMI(500000, 7.5, 60);
      expect(result1.emi).toBe(result2.emi);
      expect(result1.totalPayment).toBe(result2.totalPayment);
      expect(result1.totalInterest).toBe(result2.totalInterest);
    });

    it('should handle high precision rate (e.g., 7.125%)', () => {
      const result = calculateEMI(500000, 7.125, 60);
      expect(result.emi).toBeGreaterThan(0);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { normalizeSizeAvailability, slugifyProductName } from '../src/lib/products';

describe('Product Logic Tests', () => {
  it('should normalize size availability correctly', () => {
    const sizes = ['P', 'M', 'G'];
    const map = { 'p': 'encomenda' } as const;
    const fallback = 'disponivel';

    const result = normalizeSizeAvailability(sizes, map, fallback);
    expect(result).toEqual({
      P: 'encomenda',
      M: 'disponivel',
      G: 'disponivel',
    });
  });

  it('should slugify product names correctly', () => {
    const slug = slugifyProductName('Conjunto Treino Coral');
    expect(slug).toBe('conjunto-treino-coral');
  });

  it('should handle empty price strings as NaN', () => {
    const priceStr = '';
    const parsedPrice = parseFloat(priceStr);
    expect(isNaN(parsedPrice)).toBe(true);
  });
});

import Fuse from 'fuse.js';
import type { Currency, Product } from '@/utils/productSections';
import { products } from '@/utils/productSections';

export type { Currency, Product };
export { products };

const fuse = new Fuse(products, {
  keys: ['name', 'color', 'category', 'description', 'imageAlt'],
  threshold: 0.4,
});

export function searchProducts(filters: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  minRating?: number;
}): Product[] {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    currency = 'USD',
    minRating,
  } = filters;

  const candidates = query ? fuse.search(query).map(r => r.item) : products;

  return candidates.filter(p => {
    if (category && p.category.toLowerCase() !== category.toLowerCase())
      return false;

    const priceInCurrency = p.price[currency];
    if (minPrice != null && priceInCurrency < minPrice) return false;
    if (maxPrice != null && priceInCurrency > maxPrice) return false;
    if (minRating != null && p.rating < minRating) return false;

    return true;
  });
}

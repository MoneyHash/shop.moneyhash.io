import Fuse from 'fuse.js';
import i18n from '@/i18n/config';
import type { Currency, Product } from '@/utils/productSections';
import { products } from '@/utils/productSections';

export type { Currency, Product };
export { products };

export type Language = 'en' | 'ar';

export type LocalizedProduct = Product & {
  localizedName: string;
  localizedColor: string;
};

const CATEGORY_KEYS: Record<Product['category'], string> = {
  Shirts: 'product.categories.shirts',
  Bags: 'product.categories.bags',
};

type SearchEntry = {
  product: Product;
  name: string;
  color: string;
  category: string;
  description: string;
  imageAlt: string;
  nameAr: string;
  colorAr: string;
  categoryAr: string;
};

const tEn = i18n.getFixedT('en');
const tAr = i18n.getFixedT('ar');

const searchEntries: SearchEntry[] = products.map(product => ({
  product,
  name: product.name,
  color: product.color,
  category: product.category,
  description: product.description,
  imageAlt: product.imageAlt,
  nameAr: tAr(product.nameKey),
  colorAr: tAr(product.descriptionKey),
  categoryAr: tAr(CATEGORY_KEYS[product.category]),
}));

const fuse = new Fuse(searchEntries, {
  keys: [
    'name',
    'color',
    'category',
    'description',
    'imageAlt',
    'nameAr',
    'colorAr',
    'categoryAr',
  ],
  threshold: 0.4,
});

function localize(product: Product, language: Language): LocalizedProduct {
  const t = language === 'ar' ? tAr : tEn;
  return {
    ...product,
    localizedName: t(product.nameKey),
    localizedColor: t(product.descriptionKey),
  };
}

export function searchProducts(filters: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency: Currency;
  minRating?: number;
  language?: Language;
}): LocalizedProduct[] {
  const { query, category, minPrice, maxPrice, currency, minRating, language } =
    filters;

  const lang: Language =
    language ?? ((i18n.language as Language) === 'ar' ? 'ar' : 'en');

  const candidates = query
    ? fuse.search(query).map(r => r.item.product)
    : products;

  return candidates
    .filter(p => {
      if (category && p.category.toLowerCase() !== category.toLowerCase())
        return false;

      const priceInCurrency = p.price[currency!];
      if (minPrice != null && priceInCurrency < minPrice) return false;
      if (maxPrice != null && priceInCurrency > maxPrice) return false;
      if (minRating != null && p.rating < minRating) return false;

      return true;
    })
    .map(p => localize(p, lang));
}

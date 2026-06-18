import twoFixedDigit from '@/utils/twoFixedDigits';

/**
 * Brand-based discount rules applied after a BIN lookup.
 * Demonstrates how the card brand returned by `binLookupByReceipt` can drive
 * a promo/discount before the payment intent is created.
 */
const BRAND_DISCOUNTS: Record<string, number> = {
  mastercard: 10,
  visa: 5,
};

export function getBinDiscountPercentage(brand?: string | null): number {
  if (!brand) return 0;
  return BRAND_DISCOUNTS[brand.toLowerCase()] ?? 0;
}

export function applyDiscount(amount: number, percentage: number): number {
  return twoFixedDigit(amount - (amount * percentage) / 100);
}

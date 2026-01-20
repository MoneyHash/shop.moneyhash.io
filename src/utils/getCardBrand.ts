export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export function getCardBrand(cardNumber: string): CardBrand {
  const number = cardNumber.replace(/\D/g, '');

  if (!number) return 'unknown';

  // Visa: Starts with 4, length 13 / 16 / 19
  if (/^4/.test(number)) {
    return 'visa';
  }

  // Mastercard:
  // 51–55 OR 2221–2720
  if (
    /^(5[1-5])/.test(number) ||
    /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(number)
  ) {
    return 'mastercard';
  }

  // American Express: 34 or 37
  if (/^(34|37)/.test(number)) {
    return 'amex';
  }

  // Discover:
  // 6011, 65, 644–649
  if (/^(6011|65|64[4-9])/.test(number)) {
    return 'discover';
  }

  return 'unknown';
}

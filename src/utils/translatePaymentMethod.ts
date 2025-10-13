import { TFunction } from 'i18next';

/**
 * Translates payment method names from the MoneyHash SDK to the current locale.
 * Falls back to the original method title if no translation is found.
 *
 * @param methodTitle - The payment method title from the SDK (e.g., "Card", "Pay At Fawry")
 * @param t - The i18next translation function
 * @returns The translated payment method name
 */
export function translatePaymentMethod(
  methodTitle: string,
  t: TFunction,
): string {
  // Try to get translation from paymentMethods namespace, fallback to original title
  return t(`paymentMethods.${methodTitle}`, { defaultValue: methodTitle });
}

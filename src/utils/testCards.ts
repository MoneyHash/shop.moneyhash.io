import { type Currency } from '@/utils/productSections';

type TestCards = {
  providerName: string;
  docsLink: string;
  frictionless: string;
  challenge: string;
  failed?: string;
  customExpirationMessage?: string;
};

const checkoutTestCards: TestCards = {
  providerName: 'Checkout.com',
  docsLink:
    'https://www.checkout.com/docs/developer-resources/testing/test-cards',
  frictionless: '5436031030606378',
  challenge: '4242424242424242',
  failed: '4150561000000019',
};

const stripeTestCards: TestCards = {
  providerName: 'Stripe',
  docsLink: 'https://docs.stripe.com/testing',
  frictionless: '5555555555554444',
  challenge: '4000000000003220',
  failed: '4000000000000002',
};

const tapTestCards: TestCards = {
  providerName: 'Tap',
  docsLink: 'https://developers.tap.company/reference/testing-cards',
  frictionless: '4012000033330026',
  challenge: '5123450000000008',
  customExpirationMessage:
    'Use 01/39 as expiration date and 100 valid, 101 invalid as CVV',
};

export const testCards: Record<Currency, TestCards> = {
  EGP: checkoutTestCards,
  USD: stripeTestCards,
  AED: checkoutTestCards,
  KWD: tapTestCards,
  SAR: tapTestCards,
} as const;

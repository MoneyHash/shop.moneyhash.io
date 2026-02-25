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

const amazonTestCards: TestCards = {
  providerName: 'Amazon Payment Services',
  docsLink: 'https://paymentservices.amazon.com/docs/EN/12.html',
  frictionless: '5123456789012346',
  challenge: '5123450000000008',
  failed: '5455031252665454',
};

const peachTestCards: TestCards = {
  providerName: 'Peach Payments',
  docsLink:
    'https://developer.peachpayments.com/docs/reference-test-and-go-live',
  frictionless: '4200000000000091',
  challenge: '4200000000000042',
  failed: '4012001037461114',
};

export const testCards: Record<Currency, TestCards> = {
  EGP: checkoutTestCards,
  USD: stripeTestCards,
  AED: amazonTestCards,
  KWD: tapTestCards,
  SAR: checkoutTestCards,
  ZAR: peachTestCards,
} as const;

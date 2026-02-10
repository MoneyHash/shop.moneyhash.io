# Apple Pay Integration

Integrate Apple Pay for a native payment experience in the browser.

## Prerequisites

1. Load the Apple Pay JS SDK into your app:

```html
<script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"></script>
```

2. For TypeScript projects, install `@types/applepayjs` for type safety.

3. Get `applePayNativeData` from the express methods:

```typescript
const { expressMethods } = await moneyHash.getMethods({
  currency: '<currency>',
  amount: '<amount>',
});
const applePayMethod = expressMethods.find(m => m.id === 'APPLE_PAY');
const applePayNativeData = applePayMethod?.nativePayData;
```

## Flow

### 1. Render an Apple Pay Button

Use your own styles or follow [Apple's button guide](https://developer.apple.com/documentation/apple_pay_on_the_web/displaying_apple_pay_buttons).

### 2. Generate an Apple Pay Receipt

Add a click handler on the button:

```typescript
const session = new ApplePaySession(3, {
  countryCode: applePayNativeData.country_code,
  currencyCode: applePayNativeData.currency_code,
  supportedNetworks: applePayNativeData.supported_networks,
  merchantCapabilities: ['supports3DS'],
  total: {
    label: 'Apple Pay',
    type: 'final',
    amount: `${applePayNativeData.amount}`,
  },
  requiredShippingContactFields: ['email'], // optional: collect email
});

// Validate merchant
session.onvalidatemerchant = e =>
  moneyHash
    .validateApplePayMerchantSession({
      methodId: applePayNativeData.method_id,
      validationUrl: e.validationURL,
    })
    .then(merchantSession =>
      session.completeMerchantValidation(merchantSession),
    )
    .catch(() => {
      session.completeMerchantValidation({}); // fallback: show failure
    });

// Extract receipt
let applePayReceipt;
session.onpaymentauthorized = e => {
  applePayReceipt = {
    receipt: JSON.stringify({ token: e.payment.token }),
    receiptBillingData: {
      email: e.payment.shippingContact?.emailAddress,
    },
  };
  session.completePayment(ApplePaySession.STATUS_SUCCESS);
};

// Optional: handle sheet cancellation
session.oncancel = () => {
  console.log('ApplePay Sheet was closed');
};

// Start the session
session.begin();
```

### 3. Submit the Receipt

After obtaining the receipt, select Apple Pay as the method and submit:

```typescript
// Select Apple Pay method for the intent
await moneyHash.proceedWith({
  type: 'method',
  id: 'APPLE_PAY',
  intentId,
});

// Submit the receipt
const intentDetails = await moneyHash.submitPaymentReceipt({
  nativeReceiptData: applePayReceipt,
  intentId,
});
```

## Full Example

```typescript
const session = new ApplePaySession(3, {
  countryCode: applePayNativeData.country_code,
  currencyCode: applePayNativeData.currency_code,
  supportedNetworks: applePayNativeData.supported_networks,
  merchantCapabilities: ['supports3DS'],
  total: {
    label: 'Apple Pay',
    type: 'final',
    amount: `${applePayNativeData.amount}`,
  },
  requiredShippingContactFields: ['email'],
});

session.onvalidatemerchant = e =>
  moneyHash
    .validateApplePayMerchantSession({
      methodId: applePayNativeData.method_id,
      validationUrl: e.validationURL,
    })
    .then(merchantSession =>
      session.completeMerchantValidation(merchantSession),
    )
    .catch(() => {
      session.completeMerchantValidation({});
    });

session.onpaymentauthorized = async e => {
  const applePayReceipt = {
    receipt: JSON.stringify({ token: e.payment.token }),
    receiptBillingData: {
      email: e.payment.shippingContact?.emailAddress,
    },
  };
  session.completePayment(ApplePaySession.STATUS_SUCCESS);

  await moneyHash.proceedWith({
    type: 'method',
    id: 'APPLE_PAY',
    intentId,
  });

  const intentDetails = await moneyHash.submitPaymentReceipt({
    nativeReceiptData: applePayReceipt,
    intentId,
  });

  console.log({ intentDetails });
};

session.oncancel = () => {
  console.log('ApplePay Sheet was closed');
};

session.begin();
```

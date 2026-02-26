# Google Pay Integration

Integrate Google Pay for a native payment experience in the browser.

## Prerequisites

Install a Google Pay button package:

```sh
# Web Components
npm install @google-pay/button-element

# React
npm install @google-pay/button-react

# Angular
npm install @google-pay/button-angular

# Or load via script tag
# <script src="https://pay.google.com/gp/p/js/pay.js"></script>
```

## Get Google Pay Configuration

Retrieve `googlePayNativeData` from express methods:

```typescript
const { expressMethods } = await moneyHash.getMethods({
  currency: '<currency>',
  amount: '<amount>',
});
const googlePayMethod = expressMethods.find(m => m.id === 'GOOGLE_PAY');
const googlePayNativeData = googlePayMethod?.nativePayData;
```

### GooglePayNativeData Structure

```typescript
{
  currency_code: "<currency>",
  country_code: "..",
  amount: "<amount>",
  gateway: "moneyhash",
  gateway_merchant_id: "...",
  merchant_id: "...",
  merchant_name: "...",
  method_id: "...",
  allowed_card_networks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"],
  allowed_card_auth_methods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
}
```

## Tokenization Specification

Always use this configuration:

```json
{
  "type": "PAYMENT_GATEWAY",
  "parameters": {
    "gateway": "moneyhash",
    "gatewayMerchantId": "<your_moneyhash_account_id>"
  }
}
```

## Implementation

### Web Components

```typescript
import '@google-pay/button-element';

const button = document.querySelector('google-pay-button');
button.paymentRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: googlePayNativeData.allowed_card_auth_methods,
        allowedCardNetworks: googlePayNativeData.allowed_card_networks,
        billingAddressRequired: true,
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'moneyhash',
          gatewayMerchantId: googlePayNativeData.gateway_merchant_id,
        },
      },
    },
  ],
  merchantInfo: {
    merchantId: googlePayNativeData.merchant_id,
    merchantName: googlePayNativeData.merchant_name,
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: `${googlePayNativeData.amount}`,
    currencyCode: googlePayNativeData.currency_code,
    countryCode: googlePayNativeData.country_code,
  },
  emailRequired: true,
};
```

### React

```tsx
import GooglePayButton from '@google-pay/button-react';

function CheckoutForm() {
  return (
    <GooglePayButton
      environment="TEST" // Use "PRODUCTION" for live
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: googlePayNativeData.allowed_card_auth_methods,
              allowedCardNetworks: googlePayNativeData.allowed_card_networks,
              billingAddressRequired: true,
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'moneyhash',
                gatewayMerchantId: googlePayNativeData.gateway_merchant_id,
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: googlePayNativeData.merchant_id,
          merchantName: googlePayNativeData.merchant_name,
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: `${googlePayNativeData.amount}`,
          currencyCode: googlePayNativeData.currency_code,
          countryCode: googlePayNativeData.country_code,
        },
        emailRequired: true,
      }}
      onLoadPaymentData={handlePaymentData}
      onCancel={handleCancel}
    />
  );
}
```

## Handle Payment Data and Submit

```typescript
// Web Components: listen to loadpaymentdata event
button.addEventListener('loadpaymentdata', async event => {
  const { paymentMethodData, email } = event.detail;
  const paymentToken = paymentMethodData.tokenizationData.token;

  const googlePayReceipt = {
    receipt: paymentToken,
    receiptBillingData: { email },
  };

  // Select Google Pay method
  await moneyHash.proceedWith({
    type: 'method',
    id: 'GOOGLE_PAY',
    intentId,
  });

  // Submit the token
  const intentDetails = await moneyHash.submitPaymentReceipt({
    intentId,
    nativeReceiptData: googlePayReceipt,
  });

  console.log('Payment successful:', intentDetails);
});
```

## Branding Requirements

Follow Google's brand guidelines:

- First mention of Google Pay on each page must include the TM symbol.
- Use only official Google Pay buttons and assets.
- Do not alter button colors, aspect ratio, or minimum size.
- Place Google Pay button equal in size and prominence to other payment options.

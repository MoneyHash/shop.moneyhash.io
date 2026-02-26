# Pay with Card Information

Process a payment using collected card data. This is a Server-to-Server card flow.

## Prerequisites

- Card method connection must be configured as **Server to Server** in MoneyHash dashboard.
- Create an intent server-side using the Payment Intent API endpoint (requires Account API Key as header).

## Flow

### 1. Initialize MoneyHash

```typescript
import MoneyHash from '@moneyhash/js-sdk/headless';

const moneyHash = new MoneyHash({
  type: 'payment',
  publicApiKey: '<account_public_api_key>',
});
```

### 2. Render Card Fields and Collect Data

Render card elements (see [card-elements.md](card-elements.md)) then collect:

```typescript
const cardData = await moneyHash.cardForm.collect();
```

### 3. Pay

```typescript
const intentDetails = await moneyHash.cardForm.pay({
  intentId: '<intent_id>',
  cardData, // collected from moneyHash.cardForm.collect()
  billingData, // optional - billing field values
  shippingData, // optional - shipping field values
  saveCard: true, // optional - tokenize card for future use (default: false)
});
```

Refer to [form-fields.md](form-fields.md) for billing and shipping field schemas if they need to be collected.

### Parameters

| Name           | Type                               | Description                                   |
| -------------- | ---------------------------------- | --------------------------------------------- |
| `intentId`     | `string`                           | The payment intent ID (created server-side)   |
| `cardData`     | `object`                           | Card data from `moneyHash.cardForm.collect()` |
| `billingData`  | `Record<string, string \| number>` | Optional billing data                         |
| `shippingData` | `Record<string, string \| number>` | Optional shipping data                        |
| `saveCard`     | `boolean`                          | Optional, tokenize card for future use        |

> `saveCard` requires the intent to be created with `"allow_tokenize_card": true`.

The response is updated intent details. Handle the resulting `state` accordingly (e.g., `URL_TO_RENDER` for 3DS, `INTENT_PROCESSED` for success).

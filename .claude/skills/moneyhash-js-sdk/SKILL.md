---
name: moneyhash-js-sdk
description: MoneyHash JavaScript SDK reference for headless payment integration. Use when any user wants to ask anything about MoneyHash JS SDK, implement payments with MoneyHash, handle payment intent states, render card forms, integrate Apple Pay/Google Pay, manage subscriptions, handle installment plans, perform BIN lookups, or work with the @moneyhash/js-sdk package.
---

# MoneyHash JavaScript SDK

## Installation

based on user's package manager use the correct command to install the SDK:

```sh
npm install @moneyhash/js-sdk
# or
yarn add @moneyhash/js-sdk
# or
pnpm add @moneyhash/js-sdk
# or
bun add @moneyhash/js-sdk
```

## Initialization

Import from the headless module and create an instance:

```typescript
import MoneyHash from '@moneyhash/js-sdk/headless';

const moneyHash = new MoneyHash({
  type: 'payment',
  publicApiKey: '<account_public_api_key>',
});
```

### Parameters

- `type`: The intent type, ALWAYS `"payment"`
- `publicApiKey`: Your MoneyHash account public API key. You can ask the user for his public API Key through [MoneyHash account api dashboard](https://dashboard.moneyhash.io/account-api-key). if he didn't provide it to you.
- `locale` (optional): Locale code for localization, e.g. `"en"`, `"fr"`, `"de"`. Defaults to `"en"`.

## SDK States

The SDK uses a state-driven flow. Call `getIntentDetails(intentId)` or `getMethods({ intentId })` to get the current `state` and `stateDetails`, then handle each state accordingly.

| State                             | Action                                                                                       | Intent Type     | Reference                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------- |
| `METHOD_SELECTION`                | Retrieve and display payment methods, let user select one via `proceedWith`                  | Payment, Payout | [method-selection.md](references/method-selection.md)   |
| `FORM_FIELDS`                     | Render billing/shipping fields and/or card form from `stateDetails`, submit via `submitForm` | Payment, Payout | [form-fields.md](references/form-fields.md)             |
| `URL_TO_RENDER`                   | Render the URL from `stateDetails` using the recommended `renderStrategy` via `renderUrl`    | Payment, Payout | [url-to-render.md](references/url-to-render.md)         |
| `SAVED_CARD_CVV`                  | Collect CVV for a saved card using schema from `stateDetails`, submit via `submitCvv`        | Payment         | [saved-card-cvv.md](references/saved-card-cvv.md)       |
| `INSTALLMENT_PLANS`               | Display installment plans from `stateDetails`, user selects via `selectInstallmentPlan`      | Payment         | [installment-plans.md](references/installment-plans.md) |
| `INTENT_FORM`                     | Render MoneyHash-hosted form via `renderForm` to let MoneyHash handle the flow               | Payment, Payout | [intent-form.md](references/intent-form.md)             |
| `INTENT_PROCESSED`                | Show success UI                                                                              | Payment, Payout | [terminal-states.md](references/terminal-states.md)     |
| `TRANSACTION_FAILED`              | Show failure UI, optionally retry with `resetSelectedMethod`                                 | Payment, Payout | [terminal-states.md](references/terminal-states.md)     |
| `TRANSACTION_WAITING_USER_ACTION` | Show pending UI with `externalActionMessage` if available                                    | Payment, Payout | [terminal-states.md](references/terminal-states.md)     |
| `EXPIRED`                         | Show intent expired UI                                                                       | Payment         | [terminal-states.md](references/terminal-states.md)     |
| `CLOSED`                          | Show intent closed UI                                                                        | Payment, Payout | [terminal-states.md](references/terminal-states.md)     |
| `PROCESSING`                      | Show processing UI, poll `getIntentDetails` for updates                                      | Payment, Payout | [terminal-states.md](references/terminal-states.md)     |
| `CARD_INTENT_SUCCESSFUL`          | Show card token creation success UI                                                          | CardToken       | [terminal-states.md](references/terminal-states.md)     |
| `CARD_INTENT_FAILED`              | Show card token creation failure UI                                                          | CardToken       | [terminal-states.md](references/terminal-states.md)     |

## Additional Features

Read the relevant reference when the user needs to work with these features:

- **Card elements & collecting card data**: Render secure PCI-compliant card fields. See [card-elements.md](references/card-elements.md)
- **Pay with card**: Submit card data to process a payment. See [pay-with-card.md](references/pay-with-card.md)
- **Save card for future use**: Tokenize card data for reuse. See [save-card.md](references/save-card.md)
- **Apple Pay**: Native Apple Pay integration. See [apple-pay.md](references/apple-pay.md)
- **Google Pay**: Native Google Pay integration. See [google-pay.md](references/google-pay.md)
- **Subscription plans**: Manage recurring subscriptions. See [subscription-plans.md](references/subscription-plans.md)
- **BIN lookup**: Look up card info by BIN. See [bin-lookup.md](references/bin-lookup.md)
- **Customization**: Style inputs, buttons, and checkout. See [customization.md](references/customization.md)

## Utility Methods

```typescript
// Reset selected payment method (go back to method selection)
const intentDetails = await moneyHash.resetSelectedMethod('<intent_id>');

// Delete a saved card
const { message } = await moneyHash.deleteCard({
  cardId: '<card_id>',
  intentSecret: '<intent_secret>',
});

// Handle intent expiration
const intentDetails = await moneyHash.getIntentDetails('<intent_id>');
const cleanUpFn = moneyHash.onExpiration(
  intentDetails.intent.expirationDate,
  () => console.log('Intent expired!'),
);

// Get full intent details
const details = await moneyHash.getIntentDetails('<intent_id>');
// Returns: { intent, transaction, selectedMethod, state, stateDetails,
//           shippingData, productItems, nativePayData, recommendedMethods }
```

## Error Handling

SDK methods reject with an error object containing:

```typescript
type ErrorResponse = {
  type: string; // error category (e.g. "network", "cardValidation")
  code: number; // HTTP status code
  message: string; // human-readable message
  field: string | null;
  errors: Array<{ key: string; message: string }>;
};
```

For `submitForm` card validation errors, the rejected promise contains field-specific errors:

```typescript
{
  card_holder_name: "<error-message>",
  card_number: "<error-message>",
  cvv: "<error-message>",
  expiry_month: "<error-message>",
  expiry_year: "<error-message>",
  general_error: "<error-message>"
}
```

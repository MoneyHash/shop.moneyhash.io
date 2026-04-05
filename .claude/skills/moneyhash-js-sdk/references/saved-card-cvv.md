# SAVED_CARD_CVV State

The `SAVED_CARD_CVV` state requires collecting the CVV for a saved card before proceeding with payment.

## State Details Structure

```typescript
{
  state: "SAVED_CARD_CVV",
  stateDetails: {
    card: {
      brand: "MasterCard",
      brandIconUrl: "logo-url",
      last4Digits: "0000",
    },
    cvvField: {
      type: "text",
      name: "cvv",
      label: "CVV",
      hint: null,
      value: "",
      readOnly: false,
      validation: {
        required: true,
        minLength: 3,
        maxLength: 4,
      },
    },
  },
}
```

Use the `card` object to display which card the user is paying with (brand, icon, last 4 digits). Use the `cvvField` schema to render a CVV input field.

## Submitting CVV

After collecting the CVV value from the user, submit it:

```typescript
const res = await moneyHash.submitCvv({
  intentId: '<intent_id>',
  cvv: '123',
});
```

The response contains updated intent details with the new state.

## With Installment Plans

If using installment plans, pass `installmentPlanData` when submitting CVV:

```typescript
const res = await moneyHash.submitCvv({
  intentId: '<intent_id>',
  cvv: '123',
  installmentPlanData: {
    planId: '<plan-id>',
    issuerCode: '<issuer-code>', // include if received in plan item
  },
});
```

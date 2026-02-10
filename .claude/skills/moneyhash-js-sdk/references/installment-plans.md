# Installment Plans

Installment plans can be retrieved as an intent state or independently without an intent.

## As Intent State (INSTALLMENT_PLANS)

When the user enters an eligible card number, the intent state becomes `INSTALLMENT_PLANS`:

```typescript
{
  state: "INSTALLMENT_PLANS",
  stateDetails: {
    plans: [
      {
        id: "<plan-id>",
        installmentPeriod: 3,
        amount: {
          value: "value",       // amount with currency formatted
          formatted: 60.92,     // amount as number
          currency: "currency",
        },
        interestRate: "<interest-rate>" | null,
        upfrontFees: "<upfront-fees>" | null,
        issuerCode: "<issuer-code>",  // optional
      },
    ],
  },
}
```

### Selecting a Plan

```typescript
const intentDetails = await moneyhash.selectInstallmentPlan({
  intentId: '<intent-id>',
  planId: '<plan-id>',
  issuerCode: '<issuer-code>', // optional, pass if received in plan details
});
```

## Standalone (Without Intent)

Retrieve plans directly from the account's default payment provider:

```typescript
const plans = await moneyhash.getInstallmentPlans({
  first6Digits: '123456',
  amount: 1000,
  currency: 'EGP',
});
console.log(plans);
```

Requires `publicApiKey` set on the MoneyHash instance. The account's default payment provider must support installment plans.

## Using Plans with Payment Submission

The `submitForm`, `cardForm.pay`, and `submitCvv` methods accept an optional `installmentPlanData` parameter:

```typescript
// With submitForm
const res = await moneyHash.submitForm({
  intentId: '<intent-id>',
  accessToken: '<access-token>',
  installmentPlanData: {
    planId: '<plan-id>',
    issuerCode: '<issuer-code>', // include if received in plan item
  },
});

// With submitCvv
const res = await moneyHash.submitCvv({
  intentId: '<intent-id>',
  cvv: '123',
  installmentPlanData: {
    planId: '<plan-id>',
    issuerCode: '<issuer-code>',
  },
});
```

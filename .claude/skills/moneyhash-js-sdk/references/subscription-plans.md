# Subscription Plans

Manage customer subscriptions through MoneyHash JS SDK (v2.3.0+).

## Retrieve Subscription Plans for a Customer

Get plans based on a Plan Group ID:

```typescript
const subscriptionPlans = await moneyHash.getSubscriptionPlans({
  planGroupId: '<plan-group-id>',
  customerId: '<customer-id>',
});
console.log(subscriptionPlans);
```

### SubscriptionPlan Type

```typescript
type SubscriptionPlan = {
  id: string;
  alreadySubscribed: boolean;
  amount: number;
  created: string;
  currency: string;
  description: string;
  discountAmount: number | null;
  discountCycles: number | null;
  discountPercentage: number | null;
  name: string;
  oneTimeFee: number | null;
  recurrency: number;
  recurrencyUnit: 'MONTH';
  recurringCycles: number | null;
  trialPeriod: number | null;
  isLive: boolean;
};
```

Render the plans with your custom UI. Use `alreadySubscribed` to indicate if the customer has already subscribed to a plan.

## Subscribe to a Plan

Select a plan for the customer to subscribe:

```typescript
const intentDetails = await moneyHash.selectSubscriptionPlan({
  planGroupId: '<plan-group-id>',
  customerId: '<customer-id>',
  planId: '<selected-plan-id>',
});
```

The response returns payment intent details. Complete the payment flow using the standard JS SDK state handling.

## Retrieve Plan Groups

Get subscription plan groups with optional filtering:

```typescript
// Get all plan groups
const { planGroups, count, hasNext, hasPrevious } =
  await moneyHash.getSubscriptionPlanGroups();

// Filter by currency
const { planGroups, count, hasNext, hasPrevious } =
  await moneyHash.getSubscriptionPlanGroups({
    currency: 'EGP',
  });

// With pagination
const { planGroups, count, hasNext, hasPrevious } =
  await moneyHash.getSubscriptionPlanGroups({
    offset: 0,
    limit: 10, // default is 10
  });
```

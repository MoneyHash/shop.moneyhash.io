# METHOD_SELECTION State

Handle the `METHOD_SELECTION` state by retrieving available payment methods and letting the user select one.

## Get Account Methods

Retrieve methods for an account without an intent:

```typescript
moneyHash
  .getMethods({
    currency: '<currency>', // required
    amount: '<amount>', // optional
    customer: '<customer_id>', // optional
    flowId: '<flow_id>', // optional
    customFields: { key: 'value' }, // optional - filter flow methods
  })
  .then(
    ({
      paymentMethods,
      expressMethods,
      savedCards,
      savedBankAccounts,
      customerBalances,
    }) => {
      console.log({
        paymentMethods,
        expressMethods,
        savedCards,
        savedBankAccounts,
        customerBalances,
      });
    },
  );
```

## Get Intent Methods

Retrieve methods for a specific intent:

```typescript
moneyHash
  .getMethods({ intentId: '<intent_id>' })
  .then(
    ({
      paymentMethods,
      expressMethods,
      savedCards,
      savedBankAccounts,
      customerBalances,
    }) => {
      console.log({
        paymentMethods,
        expressMethods,
        savedCards,
        savedBankAccounts,
        customerBalances,
      });
    },
  );
```

The intent must be created server-side first using the Payment Intent API endpoint with the Account API Key as a header.

## Get Intent Details

Retrieve full intent details including current state:

```typescript
moneyHash
  .getIntentDetails('<intent_id>')
  .then(
    ({
      intent,
      transaction,
      selectedMethod,
      state,
      stateDetails,
      shippingData,
      productItems,
      nativePayData,
      recommendedMethods,
    }) => {
      console.log({ intent, transaction, selectedMethod, state, stateDetails });
    },
  );
```

## Proceed With Payment

After the user selects a payment method, proceed with it:

```typescript
moneyHash
  .proceedWith({
    intentId: '<intent_id>',
    type: 'method', // "method" | "savedCard" | "savedBankAccount" | "customerBalance"
    id: '<method_id>', // the selected method/card/balance ID
    metaData: {
      cvv: '<cvv>', // required for saved cards that require CVV
    },
  })
  .then(
    ({
      intent,
      transaction,
      selectedMethod,
      state,
      stateDetails,
      shippingData,
      productItems,
      nativePayData,
      recommendedMethods,
    }) => {
      // Handle the new state after method selection
      console.log({ state, stateDetails });
    },
  );
```

### `proceedWith` type values

| Type                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| `"method"`           | A payment method from `paymentMethods`            |
| `"savedCard"`        | A previously saved card from `savedCards`         |
| `"savedBankAccount"` | A saved bank account from `savedBankAccounts`     |
| `"customerBalance"`  | A customer wallet balance from `customerBalances` |

Express methods (Apple Pay, Google Pay) also use `type: "method"` with their specific method ID (e.g., `"APPLE_PAY"`, `"GOOGLE_PAY"`). See the Apple Pay and Google Pay references for their full flows.

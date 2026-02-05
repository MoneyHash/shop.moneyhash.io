# BIN Lookup

Look up card information based on the Bank Identification Number (BIN).

## With Full Card Data

After collecting card info via card elements:

```typescript
const cardData = await moneyHash.cardForm.collect();

try {
  const binLookup = await moneyHash.cardForm.binLookup({
    cardData,
    // flowId: "<flow_id>", // optional
  });
  console.log(binLookup); // BinLookUpData
} catch (error) {
  console.log(error);
}
```

## Dynamic BIN Lookup (8 Digits)

Available from SDK v1.17.0 / v2.2.0. Perform lookup while the user is typing the card number:

```typescript
cardNumber.on('changeInput', ({ length }) => {
  if (length === 8) {
    moneyHash.cardForm.binLookup().then(console.log).catch(console.log);
  }
});
```

### Error Responses

| Scenario           | Error                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| Card not found     | `{ code: 404, message: "", type: "network", field: null, errors: [] }`              |
| Less than 8 digits | `{ type: "cardValidation", card_number: "Card number must be at least 8 digits." }` |

## BIN Lookup with Receipts

Use receipts from Apple Pay or Google Pay for BIN lookup:

```typescript
try {
  const binLookup = await moneyHash.binLookupByReceipt({
    nativeReceiptData: applePayReceipt,
    methodId: '<method_id>',
  });
  console.log(binLookup);
} catch (error) {
  console.log(error);
}
```

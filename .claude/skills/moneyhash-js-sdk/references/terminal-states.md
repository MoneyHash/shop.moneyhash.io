# Terminal States

These states represent the end (or near-end) of a payment/payout flow.

## INTENT_PROCESSED

The intent has been successfully processed. Render a success confirmation UI.

```typescript
if (state === 'INTENT_PROCESSED') {
  // Show success UI with intent details
  console.log('Payment successful!', intent, transaction);
}
```

## TRANSACTION_FAILED

The transaction has failed. Render a failure UI and optionally offer retry.

```typescript
if (state === 'TRANSACTION_FAILED') {
  // Show failure UI
  // Optionally reset to let user try a different method:
  const newDetails = await moneyHash.resetSelectedMethod('<intent_id>');
  // newDetails.state will be METHOD_SELECTION
}
```

## TRANSACTION_WAITING_USER_ACTION

The transaction requires additional user action (e.g., 3DS confirmation, pending actions).

```typescript
if (state === 'TRANSACTION_WAITING_USER_ACTION') {
  // Show pending actions UI
  // Check transaction.externalActionMessage for guidance text if available
  console.log(transaction?.externalActionMessage);
}
```

## EXPIRED

The intent has expired. Render an expired UI. A new intent must be created to retry.

```typescript
if (state === 'EXPIRED') {
  // Show intent expired UI
}
```

## CLOSED

The intent has been closed. Render a closed UI.

```typescript
if (state === 'CLOSED') {
  // Show intent closed UI
}
```

## PROCESSING

The payment is still being processed. Show a processing UI and poll for updates.

```typescript
if (state === 'PROCESSING') {
  // Show "Your payment is processing" UI
  // Poll for new intent details
  const poll = setInterval(async () => {
    const details = await moneyHash.getIntentDetails('<intent_id>');
    if (details.state !== 'PROCESSING') {
      clearInterval(poll);
      // Handle the new state
    }
  }, 5000); // poll every 5 seconds
}
```

## CARD_INTENT_SUCCESSFUL

Card token creation was successful. Used in the save-card flow.

```typescript
if (state === 'CARD_INTENT_SUCCESSFUL') {
  // Show card token creation success UI
  console.log('Card saved successfully!', stateDetails);
}
```

## CARD_INTENT_FAILED

Card token creation failed. Used in the save-card flow.

```typescript
if (state === 'CARD_INTENT_FAILED') {
  // Show card token creation failure UI
}
```

## State Handler Pattern

A common pattern for handling all states in a single function:

```typescript
async function handleIntentState(intentDetails) {
  const { state, stateDetails, intent, transaction } = intentDetails;

  switch (state) {
    case 'METHOD_SELECTION':
      // See method-selection.md
      break;
    case 'FORM_FIELDS':
      // See form-fields.md
      break;
    case 'URL_TO_RENDER':
      // See url-to-render.md
      break;
    case 'SAVED_CARD_CVV':
      // See saved-card-cvv.md
      break;
    case 'INSTALLMENT_PLANS':
      // See installment-plans.md
      break;
    case 'INTENT_FORM':
      // See intent-form.md
      break;
    case 'INTENT_PROCESSED':
      showSuccessUI(intent, transaction);
      break;
    case 'TRANSACTION_FAILED':
      showFailureUI(intent, transaction);
      break;
    case 'TRANSACTION_WAITING_USER_ACTION':
      showPendingUI(transaction?.externalActionMessage);
      break;
    case 'EXPIRED':
      showExpiredUI();
      break;
    case 'CLOSED':
      showClosedUI();
      break;
    case 'PROCESSING':
      startPolling(intent.id);
      break;
    case 'CARD_INTENT_SUCCESSFUL':
      showCardTokenSuccess(stateDetails);
      break;
    case 'CARD_INTENT_FAILED':
      showCardTokenFailure();
      break;
  }
}
```

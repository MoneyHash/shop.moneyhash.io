# Save Card for Future Use

Tokenize card data for future payments by creating a card token.

## Prerequisites

- Create a **card intent** server-side using the Card Intent API endpoint (requires Account API Key).
- Include `"card_token_type": "UNIVERSAL"` in the card intent creation payload.

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

### 3. Create Card Token

```typescript
moneyHash.cardForm
  .createCardToken({
    cardData, // collected from moneyHash.cardForm.collect()
    cardIntentId: '<card_intent_id>',
  })
  .then(({ state, stateDetails }) => {
    console.log({ state, stateDetails });
    // state will be CARD_INTENT_SUCCESSFUL or CARD_INTENT_FAILED
  });
```

You can run any business logic between collecting card data and tokenizing it.

## Result States

| State                    | Description                     |
| ------------------------ | ------------------------------- |
| `CARD_INTENT_SUCCESSFUL` | Card token created successfully |
| `CARD_INTENT_FAILED`     | Card token creation failed      |

See [terminal-states.md](terminal-states.md) for handling these states.

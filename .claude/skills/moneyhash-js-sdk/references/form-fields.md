# FORM_FIELDS State

The `FORM_FIELDS` state indicates there are form field values to collect. Fields can include card fields, billing fields, and/or shipping fields.

## State Details Structure

```typescript
{
  state: "FORM_FIELDS",
  stateDetails: {
    formFields: {
      card: {
        accessToken: string; // valid for 5 minutes only
      },
      billing: Field[],
      shipping: Field[],
    },
  },
}
```

If card fields are needed, `accessToken` will be present in `stateDetails.formFields.card`. Use it when submitting the form. For card field rendering, see [card-elements.md](card-elements.md).

## Field Schema

```typescript
type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'phoneNumber'
  | 'select';

type Field = {
  type: FieldType;
  name: string;
  label: string;
  hint: string;
  value: string;
  readOnly: boolean;
  validation: {
    required: boolean;
    minLength: number | null;
    maxLength: number | null;
  };
  dependsOn?: string; // Field.name of a field this field depends on
  optionsList?: Array<{ label: string; value: string }>; // options for select fields
  optionsMap?: Record<string, Array<{ label: string; value: string }>>; // dependent select options
};
```

For `select` fields: use `optionsList` for standalone selects. When a select depends on another field (`dependsOn`), use `optionsMap` where keys are the parent field's values and values are the available options.

## Submitting Form Fields

Use `moneyhash.submitForm` to submit collected form data:

```typescript
const res = await moneyHash.submitForm({
  intentId: '<intent-id>',
  accessToken: stateDetails?.formFields?.card?.accessToken, // optional, for card data
  billingData: {
    name: 'John Doe',
    phoneNumber: '+20101234567',
    // ...rest of billing field values (key = Field.name)
  },
  shippingData: {
    street: '',
    postalCode: '',
    // ...rest of shipping field values (key = Field.name)
  },
  saveCard: true, // optional, save card for future use (default: false)
  paymentMethod: 'CARD', // optional, defaults to CARD
});
```

### SubmitData Parameters

| Name            | Type                               | Description                                                 |
| --------------- | ---------------------------------- | ----------------------------------------------------------- |
| `intentId`      | `string`                           | The intent ID being processed                               |
| `accessToken`   | `string \| null`                   | From `stateDetails.formFields.card` if submitting card data |
| `billingData`   | `Record<string, string \| number>` | Billing field values keyed by `Field.name`                  |
| `shippingData`  | `Record<string, string \| number>` | Shipping field values keyed by `Field.name`                 |
| `saveCard`      | `boolean`                          | Whether to save card for future use (default: `false`)      |
| `paymentMethod` | `PaymentMethodSlugs`               | Defaults to `CARD`, use if submitting for another method    |

## Validation and Submission Errors

Errors are returned via a rejected promise:

```typescript
try {
  await moneyhash.submitForm({ ... });
} catch (error) {
  console.error(error);
  /*
  error: {
    "card_holder_name": "<error-message>",
    "card_number": "<error-message>",
    "cvv": "<error-message>",
    "expiry_month": "<error-message>",
    "expiry_year": "<error-message>",
    "general_error": "<error-message>"
  }
  */
}
```

The error object keys match field names. `general_error` appears for errors not related to specific card fields.

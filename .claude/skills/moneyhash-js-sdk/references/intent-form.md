# INTENT_FORM State

The `INTENT_FORM` state indicates MoneyHash should handle the payment/payout flow via its hosted form. Use this when you want MoneyHash to manage the UI for the current step.

## Rendering the Form

```typescript
const intentDetails = await moneyHash.renderForm({
  selector: '<container_css_selector>',
  intentId: '<intent_id>',
  onHeightChange: height => {
    // Optional: dynamically adjust container height to match iframe content
    document.querySelector(
      '<container_css_selector>',
    ).style.height = `${height}px`;
  },
});
```

### Parameters

| Name             | Type                       | Description                                                       |
| ---------------- | -------------------------- | ----------------------------------------------------------------- |
| `selector`       | `string`                   | CSS selector for the container element where the form will render |
| `intentId`       | `string`                   | The intent ID to process                                          |
| `onHeightChange` | `(height: number) => void` | Optional callback to sync container height with iframe            |

The method resolves with updated intent details when the form interaction completes. Use the `onComplete` and `onFail` callbacks on the MoneyHash instance to track the end of the process.

## When to Use

- When the state is `INTENT_FORM`, call `renderForm` to delegate the flow to MoneyHash.
- You can also use `renderForm` directly (bypassing native method selection UI) to render the embed form for the full payment/payout flow.

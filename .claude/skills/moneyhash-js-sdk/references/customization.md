# Customization

Customize the appearance of MoneyHash inputs, loader, and checkout UI.

## Instance Styles

Pass `styles` when creating the MoneyHash instance:

```typescript
const moneyHash = new MoneyHash({
  type: 'payment',
  publicApiKey: '<key>',
  styles: {
    input: {
      base: {
        // Base input styles
      },
      focus: {
        // Styles when input is focused
      },
      error: {
        // Styles when input has error
      },
    },
    loader: {
      backgroundColor: '<color>',
      color: '<color>',
    },
    checkout: {
      hideAmountSidebar: true, // Hide the amount sidebar
      hideHeader: true, // Hide the checkout header
      hideLoaderMessage: true, // Hide loader message text
      hideFormHeaderMessage: true, // Hide form header message
      hideNavigationToPaymentMethods: true, // Hide back-to-methods navigation
      formOnly: true, // Show only the form without chrome
    },
  },
});
```

### Checkout Options

| Option                           | Type      | Description                             |
| -------------------------------- | --------- | --------------------------------------- |
| `hideAmountSidebar`              | `boolean` | Hide the payment amount sidebar         |
| `hideHeader`                     | `boolean` | Hide the checkout header                |
| `hideLoaderMessage`              | `boolean` | Hide the loading message text           |
| `hideFormHeaderMessage`          | `boolean` | Hide the form header message            |
| `hideNavigationToPaymentMethods` | `boolean` | Hide the back button to payment methods |
| `formOnly`                       | `boolean` | Show only the form, no surrounding UI   |

## Card Element Styles

Card elements have their own styling system via `moneyhash.elements()`. See [card-elements.md](card-elements.md) for:

- `styles` object (color, backgroundColor, placeholderColor, fontSize, fontFamily, fontStyle, fontWeight, padding, height, direction, textAlign)
- `classes` object (focus, error class names)
- `fontSourceCss` for custom fonts
- Per-element style overrides

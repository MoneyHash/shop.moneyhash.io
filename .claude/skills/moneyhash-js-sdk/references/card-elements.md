# Card Elements

Render secure PCI-compliant card input fields using the MoneyHash elements API.

## Creating Elements Context

```typescript
const elements = moneyhash.elements({
  styles: {
    color: '<text-color>', // or { base: "<text-color>", error: "<text-color>" }
    backgroundColor: '<bg-color>',
    placeholderColor: '<placeholder-color>',
    fontSize: '<font-size>',
    fontFamily: '<font-family>',
    fontStyle: 'normal' | 'italic' | 'oblique',
    fontWeight: '<font-weight>',
    padding: '<padding>',
    height: '<height>',
    direction: 'ltr' | 'rtl',
    textAlign: 'left' | 'center' | 'right',
  },
  classes: {
    focus: 'border border-blue-600',
    error: 'border border-red-500',
  },
  fontSourceCss: '<absolute URL to CSS file with @font-face definitions>',
});
```

The `styles` property applies to all input field iframes but can be overridden per field.

## Creating Card Fields

Use `elements.create()` with the element type and options:

```typescript
const cardNumber = elements.create({
  elementType: 'cardNumber', // see element types below
  elementOptions: {
    selector: '#card-number', // required - id selector of container element
    placeholder: 'Card number', // optional
    styles: {}, // optional - override common styles for this field
    classes: {}, // optional - override common classes
    inputMode: 'numeric', // optional - any valid inputmode attribute value
    validation: {
      // optional
      required: true, // cardHolderName only (default: false)
      cardNumber: true, // cardNumber only - enable Luhn validation (default: true from v1.18.0/v2.4.0)
    },
  },
});
```

### Element Types

| Type              | Required      | Notes                                          |
| ----------------- | ------------- | ---------------------------------------------- |
| `cardHolderName`  | No (optional) | Can be made required via `validation.required` |
| `cardNumber`      | Yes           | Luhn validation via `validation.cardNumber`    |
| `cardCvv`         | Yes           |                                                |
| `cardExpiryMonth` | Yes           |                                                |
| `cardExpiryYear`  | Yes           |                                                |

All elements except `cardHolderName` are required. The SDK will error if required fields are not rendered.

## Mounting and Methods

```typescript
// Mount the element into the DOM
cardNumber.mount();

// Programmatic control
cardNumber.focus(); // Focus the element
cardNumber.blur(); // Remove focus
cardNumber.clear(); // Clear the element value
```

## Element Events

Subscribe with `element.on(event, callback)`, unsubscribe with `element.off(event)`:

```typescript
cardNumber.on('mount', () => {
  console.log('Element mounted and ready');
  cardNumber.focus();
});

cardNumber.on('focus', () => {
  console.log('Element focused');
});

cardNumber.on('blur', () => {
  console.log('Element blurred');
});

cardNumber.on('error', ({ isValid, error }) => {
  // isValid: boolean, error: string | null
  console.log('Validity changed', { isValid, error });
});

cardNumber.on('changeInput', ({ isValid, length }) => {
  console.log('Input changed', { isValid, length });
});

// cardNumber-specific event: fires when first 6-8 digits change
cardNumber.on(
  'cardNumberChange',
  ({ first6Digits, first8Digits, brand, brandIconUrl }) => {
    console.log('Card detected:', brand);
    // Returns "Unknown" card info if not recognized or card number removed
  },
);

cardNumber.on('key:Backspace', () => {
  console.log('Backspace pressed');
});

cardNumber.on('key:Enter', () => {
  console.log('Enter pressed');
});

// Unsubscribe from an event
cardNumber.off('blur');
```

## Form Validity

Listen for overall form validity changes on the `elements` object:

```typescript
elements.on('validityChange', (isValid: boolean) => {
  console.log('Form valid:', isValid);
  // Enable/disable submit button based on validity
});
```

Card numbers with length 13-19 are considered valid. Luhn validation is enabled by default from v1.18.0 / v2.4.0.

## Collecting Card Data

After fields are filled, collect the card data:

```typescript
const cardData = await moneyHash.cardForm.collect();
```

Use this `cardData` with `cardForm.pay()`, `cardForm.createCardToken()`, or `cardForm.binLookup()`.

## Custom Classes

When elements are mounted, default classes are attached:

- `.MoneyHashElement` - all elements
- `.MoneyHashElement--focus` - focused element
- `.MoneyHashElement--error` - element with validation error

Override with the `classes` property (on `moneyhash.elements()` for all, or `elements.create()` per field):

```typescript
classes: {
  focus: "border border-blue-600",   // replaces .MoneyHashElement--focus
  error: "border border-red-500",    // replaces .MoneyHashElement--error
}
```

## Localization

Direction is inherited from the locale set on the MoneyHash instance. Supported locales: `"en"` | `"ar"` | `"fr"`.

Override direction globally via `moneyhash.elements({ styles: { direction: "rtl" } })` or per element via `elementOptions.styles.direction`.

The locale also affects validation error messages.

## Full Example

```typescript
const elements = moneyhash.elements({
  styles: {
    color: '#333',
    backgroundColor: '#fff',
    fontSize: '14px',
    padding: '8px',
    height: '40px',
  },
});

const cardHolderName = elements.create({
  elementType: 'cardHolderName',
  elementOptions: {
    selector: '#card-holder-name',
    placeholder: 'Enter card holder name...',
  },
});

const cardNumber = elements.create({
  elementType: 'cardNumber',
  elementOptions: { selector: '#card-number', placeholder: 'Card number' },
});

const cardCvv = elements.create({
  elementType: 'cardCvv',
  elementOptions: { selector: '#card-cvv', placeholder: 'CVV' },
});

const cardExpiryMonth = elements.create({
  elementType: 'cardExpiryMonth',
  elementOptions: { selector: '#card-expiry-month', placeholder: 'MM' },
});

const cardExpiryYear = elements.create({
  elementType: 'cardExpiryYear',
  elementOptions: { selector: '#card-expiry-year', placeholder: 'YY' },
});

// Mount all elements
cardHolderName.mount();
cardNumber.mount();
cardCvv.mount();
cardExpiryMonth.mount();
cardExpiryYear.mount();

// Listen for form validity
elements.on('validityChange', isValid => {
  document.getElementById('submit-btn').disabled = !isValid;
});

// Collect card data when ready
const cardData = await moneyHash.cardForm.collect();
```

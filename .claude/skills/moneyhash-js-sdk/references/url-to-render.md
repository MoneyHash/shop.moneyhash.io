# URL_TO_RENDER State

The `URL_TO_RENDER` state indicates there is a URL to render, typically for 3DS verification, external payment pages, or provider-specific flows.

## State Details Structure

```typescript
{
  state: "URL_TO_RENDER",
  stateDetails: {
    url: string,
    renderStrategy: "IFRAME" | "POPUP_IFRAME" | "REDIRECT",
  },
}
```

## Render URL

Use `moneyHash.renderUrl()` to handle URL rendering automatically:

```typescript
const intentDetails = await moneyHash.renderUrl({
  intentId: '<intent_id>',
  url: '<rendered-url>',
  renderStrategy: "<'IFRAME' | 'POPUP_IFRAME' | 'REDIRECT'>",
});
```

## Render Strategies

### IFRAME

Appends an iframe inside a container with id `#rendered-url-iframe-container`. The element must exist in the DOM or the method throws an error. After the process completes, the iframe is removed and the promise resolves with new intent details.

```html
<div id="rendered-url-iframe-container"></div>
```

### POPUP_IFRAME

Opens the URL in a popup window. After the process completes, the popup closes and the promise resolves with new intent details. Throws an error if the browser blocks popups.

### REDIRECT

Opens the URL in the same window. Pass `redirectToNewWindow` flag in options to open in a new tab instead:

```typescript
const intentDetails = await moneyHash.renderUrl({
  intentId: '<intent_id>',
  url: '<rendered-url>',
  renderStrategy: 'REDIRECT',
  options: {
    redirectToNewWindow: true, // opens in a new tab
  },
});
```

## Typical Usage

```typescript
const details = await moneyHash.getIntentDetails('<intent_id>');

if (details.state === 'URL_TO_RENDER') {
  const { url, renderStrategy } = details.stateDetails;

  const newDetails = await moneyHash.renderUrl({
    intentId: '<intent_id>',
    url,
    renderStrategy,
  });

  // Handle the new state after URL rendering completes
  console.log(newDetails.state);
}
```

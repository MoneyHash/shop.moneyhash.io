/* eslint-disable no-console */

import MoneyHashHeadless, {
  type MoneyHashHeadless as MoneyHashHeadlessInstance,
} from '@moneyhash/js-sdk/headless';
import Agentic from '@moneyhash/js-sdk/agentic';
import safeLocalStorage from '@/utils/safeLocalStorage';
import { loadMoneyHashEnv, storeMoneyHashEnv } from '@/utils/moneyHashEnv';

// The shop (home, checkout, order, chatbot) keeps its environment under `env`.
// The standalone test pages (apple-pay, google-pay, …) each have their own key
// and never load this module.
const SHOP_ENV_KEY = 'env';

// Local override for the MoneyHash embed iframe — point the SDK (and the
// `agentic` plugin, which talks to the agentic service through the iframe) at a
// locally-run embed project. Set via `localStorage.setItem('embedUrl', 'http://localhost:8080')`.
const embedUrlOverride = localStorage.getItem('embedUrl');

export const localEnv = loadMoneyHashEnv(SHOP_ENV_KEY, {
  embedUrl: embedUrlOverride,
});

declare global {
  interface Window {
    switchEnvironment: (env: string) => void;
  }
}

window.switchEnvironment = env => {
  const isValidEnv = ['staging', 'production', 'preprod'].includes(env);

  if (env && !isValidEnv) {
    console.error(
      `Invalid environment: ${env}, Allowed "staging" "production" "preprod"`,
    );
    return;
  }

  storeMoneyHashEnv(
    SHOP_ENV_KEY,
    env || (localEnv === 'production' ? 'staging' : 'production'),
  );
};

console.log('Environment:', localEnv);
if (embedUrlOverride) {
  console.log('MoneyHash embed iframe override:', embedUrlOverride);
}

const bodyStyles = window.getComputedStyle(document.body);
const loaderColor = `hsl(${window
  .getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')})`;

// The `agentic` plugin ships its own copies of the SDK's internal plugin types
// (separate `dist/agentic.d.ts`), so `new Agentic()` isn't nominally assignable
// to the `headless` entry's `MoneyHashPlugin` type. Bridge the plugins array and
// re-assert `.agentic` on the instance so callers get the real plugin typing.
export const moneyHash = new MoneyHashHeadless({
  type: 'payment',
  styles: {
    loader: {
      backgroundColor: bodyStyles.backgroundColor,
      color: loaderColor,
    },
  },
  publicApiKey: safeLocalStorage.getItem('publicApiKey') || '',
  locale: safeLocalStorage.getItem('language') || 'en',
  plugins: [new Agentic()] as unknown as [],
}) as unknown as MoneyHashHeadlessInstance<'payment'> & { agentic: Agentic };

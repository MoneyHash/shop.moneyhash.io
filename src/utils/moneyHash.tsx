/* eslint-disable no-console */

import MoneyHashHeadless, {
  type MoneyHashHeadless as MoneyHashHeadlessInstance,
} from '@moneyhash/js-sdk/headless';
import Agentic from '@moneyhash/js-sdk/agentic';
import { ACCOUNT_PUBLIC_API_KEY } from '@/api';
import safeLocalStorage from '@/utils/safeLocalStorage';

export const localEnv = localStorage.getItem('env') || 'production';

declare global {
  interface Window {
    switchEnvironment: (env: string) => void;
    MONEYHASH_IFRAME_URL?: string;
    API_URL?: string;
    MONEYHASH_VAULT_INPUT_IFRAME_URL?: string;
    MONEYHASH_VAULT_API_URL?: string;
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

  localStorage.setItem(
    'env',
    env || (localEnv === 'production' ? 'staging' : 'production'),
  );

  window.location.reload();
};

console.log('Environment:', localEnv);

if (localEnv === 'staging') {
  window.MONEYHASH_IFRAME_URL = 'https://stg-embed.moneyhash.io';
  // window.MONEYHASH_IFRAME_URL = 'http://localhost:8080';

  window.API_URL = 'https://staging-web.moneyhash.io';
  window.MONEYHASH_VAULT_INPUT_IFRAME_URL =
    'https://vault-staging-form.moneyhash.io';
  window.MONEYHASH_VAULT_API_URL = 'https://vault-staging.moneyhash.io';
} else if (localEnv === 'preprod') {
  window.MONEYHASH_IFRAME_URL = 'https://preprod-embed.moneyhash.io';
  window.API_URL = 'https://preprod-web.moneyhash.io';

  window.MONEYHASH_VAULT_INPUT_IFRAME_URL =
    'https://vault-staging-form.moneyhash.io';
  window.MONEYHASH_VAULT_API_URL = 'https://vault-staging.moneyhash.io';
}

// Local override for the MoneyHash embed iframe — point the SDK (and the
// `agentic` plugin, which talks to the agentic service through the iframe) at a
// locally-run embed project. Set via `localStorage.setItem('embedUrl', 'http://localhost:8080')`.
const embedUrlOverride = localStorage.getItem('embedUrl');
if (embedUrlOverride) {
  window.MONEYHASH_IFRAME_URL = embedUrlOverride;
  console.log('MoneyHash embed iframe override:', embedUrlOverride);
}

const bodyStyles = window.getComputedStyle(document.body);
const loaderColor = `hsl(${window
  .getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')})`;

// Point the SDK (and the `agentic` plugin's SDK communication iframe) at the
// locally-run embed while the agentic service isn't deployed yet.
// window.MONEYHASH_IFRAME_URL = 'http://localhost:8080';

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
  publicApiKey:
    safeLocalStorage.getItem('publicApiKey') || ACCOUNT_PUBLIC_API_KEY,
  locale: safeLocalStorage.getItem('language') || 'en',
  plugins: [new Agentic()] as unknown as [],
}) as unknown as MoneyHashHeadlessInstance<'payment'> & { agentic: Agentic };

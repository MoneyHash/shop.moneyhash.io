/* eslint-disable no-console */

import MoneyHashHeadless from '@moneyhash/js-sdk/headless';
import { ACCOUNT_PUBLIC_API_KEY } from '@/api';
import safeLocalStorage from '@/utils/safeLocalStorage';

export const localEnv = localStorage.getItem('env') || 'production';

declare global {
  interface Window {
    switchEnvironment: (env: string) => void;
    MONEYHASH_IFRAME_URL: string;
    API_URL: string;
    MONEYHASH_VAULT_INPUT_IFRAME_URL: string;
    MONEYHASH_VAULT_API_URL: string;
  }
}

window.switchEnvironment = env => {
  const isValidEnv = ['staging', 'production'].includes(env);

  if (env && !isValidEnv) {
    console.error(
      `Invalid environment: ${env}, Allowed "staging" "production"`,
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
}

export const moneyHash = new MoneyHashHeadless({
  type: 'payment',
  styles: {
    loader: {
      backgroundColor: 'white',
      color: 'black',
    },
  },
  publicApiKey:
    safeLocalStorage.getItem('publicApiKey') || ACCOUNT_PUBLIC_API_KEY,
});

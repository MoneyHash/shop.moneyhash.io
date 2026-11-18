/* eslint-disable no-console */
import safeLocalStorage from './safeLocalStorage';

export const environments = ['staging', 'production', 'preprod'] as const;
export type Env = typeof environments[number];

const storedEnv = safeLocalStorage.getItem('env');
export const localEnv: Env = environments.includes(storedEnv as Env)
  ? (storedEnv as Env)
  : 'production';

export const apiBaseURLs: Record<Env, string> = {
  staging: 'https://staging-web.moneyhash.io/api/v1.1',
  production: 'https://web.moneyhash.io/api/v1.1',
  preprod: 'https://preprod-web.moneyhash.io/api/v1.1',
};

declare global {
  interface Window {
    switchEnvironment: (env?: string) => void;
    MONEYHASH_IFRAME_URL?: string;
    API_URL?: string;
    MONEYHASH_VAULT_INPUT_IFRAME_URL?: string;
    MONEYHASH_VAULT_API_URL?: string;
  }
}

window.switchEnvironment = env => {
  if (env && !environments.includes(env as Env)) {
    console.error(
      `Invalid environment: ${env}, Allowed "staging" "production" "preprod"`,
    );
    return;
  }

  safeLocalStorage.setItem(
    'env',
    env || (localEnv === 'production' ? 'staging' : 'production'),
  );
  window.location.reload();
};

console.log('Environment:', localEnv);

type SdkHostKey =
  | 'MONEYHASH_IFRAME_URL'
  | 'API_URL'
  | 'MONEYHASH_VAULT_INPUT_IFRAME_URL'
  | 'MONEYHASH_VAULT_API_URL';

// Production uses the SDK's built-in defaults.
const sdkHosts: Partial<Record<Env, Record<SdkHostKey, string>>> = {
  staging: {
    MONEYHASH_IFRAME_URL: 'https://stg-embed.moneyhash.io',
    API_URL: 'https://staging-web.moneyhash.io',
    MONEYHASH_VAULT_INPUT_IFRAME_URL: 'https://vault-staging-form.moneyhash.io',
    MONEYHASH_VAULT_API_URL: 'https://vault-staging.moneyhash.io',
  },
  preprod: {
    MONEYHASH_IFRAME_URL: 'https://preprod-embed.moneyhash.io',
    API_URL: 'https://preprod-web.moneyhash.io',
    MONEYHASH_VAULT_INPUT_IFRAME_URL: 'https://vault-staging-form.moneyhash.io',
    MONEYHASH_VAULT_API_URL: 'https://vault-staging.moneyhash.io',
  },
};

// Point the SDK at the selected environment. Must run before the SDK is used.
// Hosts already set on `window` (e.g. a local tunnel in index.html) win.
Object.entries(sdkHosts[localEnv] ?? {}).forEach(([key, url]) => {
  const k = key as SdkHostKey;
  if (window[k]) {
    console.log(`SDK host override kept: ${k} = ${window[k]}`);
  } else {
    window[k] = url;
  }
});

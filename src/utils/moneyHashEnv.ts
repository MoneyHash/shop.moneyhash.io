export type MoneyHashEnv = 'production' | 'staging' | 'preprod';

declare global {
  interface Window {
    MONEYHASH_IFRAME_URL?: string;
    API_URL?: string;
    MONEYHASH_VAULT_INPUT_IFRAME_URL?: string;
    MONEYHASH_VAULT_API_URL?: string;
  }
}

const SDK_GLOBAL_KEYS = [
  'MONEYHASH_IFRAME_URL',
  'API_URL',
  'MONEYHASH_VAULT_INPUT_IFRAME_URL',
  'MONEYHASH_VAULT_API_URL',
] as const;

type SdkGlobals = Partial<Record<typeof SDK_GLOBAL_KEYS[number], string>>;

// Production is the SDK's built-in default, so it sets no overrides.
const ENV_GLOBALS: Record<MoneyHashEnv, SdkGlobals> = {
  production: {},
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

export const isMoneyHashEnv = (env: unknown): env is MoneyHashEnv =>
  typeof env === 'string' && env in ENV_GLOBALS;

/**
 * Reads a page's environment from its own localStorage key and points the SDK's
 * `window.*` URL globals at it. Every global is set or cleared, so nothing
 * from another environment leaks in.
 *
 * The SDK shares one communication iframe across all instances and builds it
 * with the URL current when the first instance is created, so call this at
 * module level, BEFORE `new MoneyHash(...)`.
 */
export function loadMoneyHashEnv(
  storageKey: string,
  { embedUrl }: { embedUrl?: string | null } = {},
): MoneyHashEnv {
  const stored = localStorage.getItem(storageKey);
  const env = isMoneyHashEnv(stored) ? stored : 'production';

  const globals: SdkGlobals = {
    ...ENV_GLOBALS[env],
    ...(embedUrl ? { MONEYHASH_IFRAME_URL: embedUrl } : {}),
  };
  SDK_GLOBAL_KEYS.forEach(key => {
    const value = globals[key];
    if (value) window[key] = value;
    else delete window[key];
  });

  return env;
}

/** Persists a page's environment under its own key and reloads to apply it. */
export function storeMoneyHashEnv(storageKey: string, env: string) {
  localStorage.setItem(storageKey, env);
  window.location.reload();
}

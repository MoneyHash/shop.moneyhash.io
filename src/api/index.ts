import axios from 'axios';
import safeLocalStorage from '@/utils/safeLocalStorage';

const localEnv = (localStorage.getItem('env') || 'production') as
  | 'staging'
  | 'production';

const config = {
  staging: {
    baseURL: 'https://staging-web.moneyhash.io/api/v1.1',
    accountApiKey: 'wocSeGMI.e3l92r5b9NYXVgTLfBXvED88oppdsi3H',
    accountPublicApiKey:
      'public.nFsXq2BS.rwzwRJAZaq8jEEPZcnMldOSFXIqklPOe9QXaOwW1',
  },
  production: {
    baseURL: 'https://web.moneyhash.io/api/v1.1',
    accountApiKey: 'NMyQeKCE.PE1ibNHTXepIxg0hyYrmU4LzK4sNdUS1',
    accountPublicApiKey:
      'public.WsCZwBVz.mUyakj73ByciUGMOE1UYvGSFDJC7uu6ftLs4C5fy',
  },
} as const;

const { baseURL, accountApiKey, accountPublicApiKey } = config[localEnv];

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.response.use(res => res.data);

// Production API key
const ACCOUNT_API_KEY = accountApiKey;
export const ACCOUNT_PUBLIC_API_KEY = accountPublicApiKey;

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] =
    safeLocalStorage.getItem('apiKey') || ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

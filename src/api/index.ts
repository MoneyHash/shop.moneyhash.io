import axios from 'axios';
import safeLocalStorage from '@/utils/safeLocalStorage';

const localEnv = (localStorage.getItem('env') || 'production') as
  | 'staging'
  | 'production'
  | 'preprod';

const baseURLs = {
  staging: 'https://staging-web.moneyhash.io/api/v1.1',
  production: 'https://web.moneyhash.io/api/v1.1',
  preprod: 'https://preprod-web.moneyhash.io/api/v1.1',
} as const;

const axiosInstance = axios.create({
  baseURL: baseURLs[localEnv],
});

axiosInstance.interceptors.response.use(res => res.data);

export function hasAccountKeys() {
  return (
    !!safeLocalStorage.getItem('apiKey') &&
    !!safeLocalStorage.getItem('publicApiKey')
  );
}

axiosInstance.interceptors.request.use(config => {
  const apiKey = safeLocalStorage.getItem('apiKey');
  if (!apiKey) {
    return Promise.reject(new Error('Missing API key — set it in Config'));
  }
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = apiKey;
  return config;
});

export default axiosInstance;

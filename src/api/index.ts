import axios from 'axios';
import safeLocalStorage from '@/utils/safeLocalStorage';

const axiosInstance = axios.create({
  baseURL: 'https://web.moneyhash.io/api/v1.1',
  // baseURL: 'https://staging-web.moneyhash.io/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

// Production API key
const ACCOUNT_API_KEY = 'NMyQeKCE.PE1ibNHTXepIxg0hyYrmU4LzK4sNdUS1';

// Staging API key
// const ACCOUNT_API_KEY = 'wocSeGMI.e3l92r5b9NYXVgTLfBXvED88oppdsi3H';

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] =
    safeLocalStorage.getItem('apiKey') || ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

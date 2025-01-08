import axios from 'axios';
import safeLocalStorage from '@/utils/safeLocalStorage';

const axiosInstance = axios.create({
  // baseURL: 'https://web.moneyhash.io/api/v1.1',
  baseURL: 'https://staging-web.moneyhash.io/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

// Production API key
// const ACCOUNT_API_KEY = 'NMyQeKCE.PE1ibNHTXepIxg0hyYrmU4LzK4sNdUS1';
// export const ACCOUNT_PUBLIC_API_KEY =
//   'public.WsCZwBVz.mUyakj73ByciUGMOE1UYvGSFDJC7uu6ftLs4C5fy';

// Staging API key
const ACCOUNT_API_KEY = 'wocSeGMI.e3l92r5b9NYXVgTLfBXvED88oppdsi3H';
export const ACCOUNT_PUBLIC_API_KEY =
  'public.nFsXq2BS.rwzwRJAZaq8jEEPZcnMldOSFXIqklPOe9QXaOwW1';

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] =
    safeLocalStorage.getItem('apiKey') || ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

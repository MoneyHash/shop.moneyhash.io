import axios from 'axios';
import safeLocalStorage from '../utils/safeLocalStorage';
import { apiBaseURLs, localEnv } from '../utils/environment';

const axiosInstance = axios.create({
  baseURL: apiBaseURLs[localEnv],
});

axiosInstance.interceptors.response.use(res => res.data);

export function hasAccountKey() {
  return !!safeLocalStorage.getItem('apiKey');
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

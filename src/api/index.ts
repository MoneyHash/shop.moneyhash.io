import axios from 'axios';
import { isSafari } from '@braintree/browser-detection';

const axiosInstance = axios.create({
  // baseURL: 'https://staging-web.moneyhash.io/api/v1.1', // staging
  baseURL: 'https://web.moneyhash.io/api/v1.1', // TODO: production
});

axiosInstance.interceptors.response.use(res => res.data);

// const ACCOUNT_API_KEY = 'lMEv4X5O.gu7Eo6vYYeiNkeY6rWogqe8fXSkcruva'; // staging
const ACCOUNT_API_KEY = 'Fe0mKMmc.DzQA3Jb4ehjAVyBP64O88LHfDqcQ8hjB'; // TODO: production

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = ACCOUNT_API_KEY;
  if (!isSafari()) {
    // eslint-disable-next-line no-console
    console.log('Not Safari override user agent');
    // eslint-disable-next-line no-param-reassign
    config.headers['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  }
  return config;
});

export default axiosInstance;

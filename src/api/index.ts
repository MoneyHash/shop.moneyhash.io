import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://web.moneyhash.io/api/v1.1',
  baseURL: 'https://staging-web.moneyhash.io/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

// Production API key
// const ACCOUNT_API_KEY = 'FLMn2Ux5.dev7XQ9wqrZyxJjjgNXFkrG455YDf6r5'; // Account: (XZOJyog: Rick Garage)

// Staging API key
const ACCOUNT_API_KEY = 'sjnhi2lf.S1YLEyimkbIdNjjKnujDvmRscxAEkJAt';

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

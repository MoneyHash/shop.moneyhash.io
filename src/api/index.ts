import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://web.moneyhash.io/api/v1.1',
  baseURL: 'https://staging-web.moneyhash.io/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

// Production API key
// const ACCOUNT_API_KEY = 'EfCaIrqh.zRPMYJB01QZWttvRjJWEEh87xiiY6HbS';

// Staging API key
const ACCOUNT_API_KEY = 'wocSeGMI.e3l92r5b9NYXVgTLfBXvED88oppdsi3H';

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

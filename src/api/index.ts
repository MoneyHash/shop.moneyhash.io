import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://web.moneyhash.io/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

const ACCOUNT_API_KEY = 'EfCaIrqh.zRPMYJB01QZWttvRjJWEEh87xiiY6HbS';

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

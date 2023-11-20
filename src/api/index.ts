import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://staging-web.moneyhash.io/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

const SANDBOX_API_KEY = 'EAmTI7Ne.gHiWZPR23gwPo3UIeYQZ7EirALzfZzEc';
axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = SANDBOX_API_KEY;
  return config;
});

export default axiosInstance;

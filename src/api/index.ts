import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://b207-45-243-170-29.ngrok-free.app/api/v1.1',
});

axiosInstance.interceptors.response.use(res => res.data);

// const ACCOUNT_API_KEY = 'KpTgel7x.F8wDAPinQRCRjlfIkShohBJC89F5Yakh';
const ACCOUNT_API_KEY = '5e8ZrVFB.oSpd8VTKBKyZqx4HGuNNhhhzPC0tbAFb';

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

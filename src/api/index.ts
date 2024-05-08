import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://staging-web.moneyhash.io/api/v1.1', // staging
  baseURL: 'https://web.moneyhash.io/api/v1.1', // TODO: production
});

axiosInstance.interceptors.response.use(res => res.data);

// const ACCOUNT_API_KEY = 'lMEv4X5O.gu7Eo6vYYeiNkeY6rWogqe8fXSkcruva'; // staging
const ACCOUNT_API_KEY = 'Fe0mKMmc.DzQA3Jb4ehjAVyBP64O88LHfDqcQ8hjB'; // TODO: production
// const ACCOUNT_API_KEY = 'KpTgel7x.F8wDAPinQRCRjlfIkShohBJC89F5Yakh'; // Decathlon

axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-api-key'] = ACCOUNT_API_KEY;
  return config;
});

export default axiosInstance;

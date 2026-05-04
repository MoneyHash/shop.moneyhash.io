const PROD_AGENT_API_URL = ''; // TODO: set to the production agent backend URL

export const AGENT_API_BASE_URL = import.meta.env.PROD
  ? PROD_AGENT_API_URL
  : 'http://localhost:4000/api';

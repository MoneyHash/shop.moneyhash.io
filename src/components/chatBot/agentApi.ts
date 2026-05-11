const PROD_AGENT_API_URL = 'https://money-hash-chatbot-agent.vercel.app/api';

export const AGENT_API_BASE_URL = import.meta.env.PROD
  ? PROD_AGENT_API_URL
  : 'http://localhost:4000/api';

import axios from 'axios';

import { AGENT_API_BASE_URL } from '../agentApi';

export type AgenticProduct = {
  name: string;
  amount: string;
  qty: number;
};

type ConsentResponse = {
  consentId: string;
  intentId: string;
  intentSecret?: string;
};

// Ask the agent backend to create an agentic consent. The backend proxies to the
// agentic service, which returns the consent id and a zero-auth intent id the
// customer authorizes with a new card (CIT).
export default function createAgenticConsent({
  customerId,
  currency,
  products,
}: {
  customerId: string;
  currency: string;
  products: AgenticProduct[];
}): Promise<ConsentResponse> {
  return axios
    .post(`${AGENT_API_BASE_URL}/agentic/consent`, {
      customerId,
      currency,
      products,
    })
    .then(res => res.data);
}

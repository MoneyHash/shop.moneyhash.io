import axios from 'axios';

import { AGENT_API_BASE_URL } from '../agentApi';

type ProductItem = {
  name: string;
  description: string;
  amount: number;
  quantity: number;
};

type IntentResponse = {
  data: {
    id: string;
    payment_status: {
      status: string;
    };
    active_transaction: { id: string } | null;
  };
};

export default function createIntent({
  amount,
  currency,
  productItems,
  type,
  customerId,
  backgroundColor,
}: {
  amount: number;
  currency: string;
  type: 'cit' | 'mit' | 'apple_pay';
  productItems: ProductItem[];
  customerId: string;
  backgroundColor: string;
}): Promise<IntentResponse> {
  return axios
    .post(`${AGENT_API_BASE_URL}/payments/intent`, {
      type,
      amount,
      currency,
      customerId,
      productItems,
      backgroundColor,
    })
    .then(res => res.data);
}

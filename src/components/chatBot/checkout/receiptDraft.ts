import axios from 'axios';

import { AGENT_API_BASE_URL } from '../agentApi';
import type { ReceiptItem } from '../types';

export type ReceiptDraft = {
  consentId: string;
  customerId: string;
  currency: string;
  total: number;
  items: ReceiptItem[];
};

// Post the rich receipt snapshot (product images, resolved names, routing
// customerId) captured at passkey-authorize time. The agent backend reads it
// back by consentId to render the receipt — inline for immediate charges, or
// surfaced on the chat's next receipt poll once a deferred "pay later" charge
// lands. Fire-and-forget: the payment must not hinge on this succeeding.
export function saveReceiptDraft(draft: ReceiptDraft): Promise<void> {
  return axios
    .post(`${AGENT_API_BASE_URL}/agentic/receipt-draft`, draft)
    .then(() => undefined)
    .catch(() => undefined);
}

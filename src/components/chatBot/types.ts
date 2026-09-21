import type { UIMessage } from '@ai-sdk/react';
import type {
  Language,
  LocalizedProduct,
  Product,
} from './clientTools/searchProductsAgentTool';
import type {
  AddToCartInput,
  AddToCartResult,
} from './clientTools/addToCartAgentTool';
import type {
  RemoveFromCartInput,
  RemoveFromCartResult,
} from './clientTools/removeFromCartAgentTool';
import type {
  ClearCartInput,
  ClearCartResult,
} from './clientTools/clearCartAgentTool';
import type { CheckoutResult } from './checkout/result';

// A single receipt line item. Images/colours are present when the receipt was
// built from a client draft, and omitted when the backend fell back to the
// queue/agent data (e.g. a draft that expired before the deferred charge ran).
export type ReceiptItem = {
  id: string;
  name: string;
  color?: string;
  imageSrc?: string;
  imageAlt?: string;
  quantity: number;
  price: number;
};

// A completed agentic payment receipt — returned inline for immediate charges
// and picked up by the chat's receipt poll once a deferred ("pay later") charge
// lands.
export type Receipt = {
  id: string;
  kind: 'immediate' | 'scheduled' | 'failed';
  consentId: string;
  customerId: string;
  transactionId?: string;
  currency: string;
  total: number;
  items: ReceiptItem[];
  chargedAt: string;
  error?: string;
};

export type StoreAgentTools = {
  query?: string;
  category?: 'Shirts' | 'Bags';
  currency?: 'USD' | 'EGP' | 'SAR' | 'AED' | 'KWD' | 'ZAR';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  language?: Language;
};

export type CartItem = Product & { quantity: number };

type ChatUITools = {
  searchProducts: {
    input: StoreAgentTools;
    output: LocalizedProduct[];
  };
  findProducts: {
    input: StoreAgentTools;
    output: LocalizedProduct[];
  };
  getCart: {
    input: Record<string, never>;
    output: CartItem[];
  };
  addToCart: {
    input: AddToCartInput;
    output: AddToCartResult;
  };
  removeFromCart: {
    input: RemoveFromCartInput;
    output: RemoveFromCartResult;
  };
  clearCart: {
    input: ClearCartInput;
    output: ClearCartResult;
  };
  proceedToCheckout: {
    input: { paymentType?: 'card' | 'apple_pay' };
    output: CheckoutResult;
  };
  executeAgenticPayment: {
    input: {
      consentId: string;
      amount: string;
      currency: string;
      when?: 'now' | 'later';
      delaySeconds?: number;
    };
    output:
      | { status: 'SUCCEEDED'; transactionId?: string; receipt?: Receipt }
      | { status: 'SCHEDULED'; delaySeconds: number }
      | { status: 'FAILED'; error?: unknown };
  };
};

type ChatUIDataParts = {
  // Async receipt picked up by the chat's receipt poll after a deferred charge
  // lands.
  receipt: Receipt;
};

export type ChatUIMessage = UIMessage<unknown, ChatUIDataParts, ChatUITools>;

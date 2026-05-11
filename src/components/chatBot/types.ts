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
};

export type ChatUIMessage = UIMessage<unknown, never, ChatUITools>;

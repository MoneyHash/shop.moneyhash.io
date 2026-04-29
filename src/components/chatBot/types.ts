import type { UIMessage } from '@ai-sdk/react';
import type { Product } from './clientTools/searchProductsAgentTool';
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

export type StoreAgentTools = {
  query?: string;
  category?: 'Shirts' | 'Bags';
  currency?: 'USD' | 'EGP' | 'SAR' | 'AED' | 'KWD' | 'ZAR';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

export type CartItem = Product & { quantity: number };

type ChatUITools = {
  searchProducts: {
    input: StoreAgentTools;
    output: Product[];
  };
  findProducts: {
    input: StoreAgentTools;
    output: Product[];
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
};

export type ChatUIMessage = UIMessage<unknown, never, ChatUITools>;

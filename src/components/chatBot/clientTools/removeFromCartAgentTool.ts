import useShoppingCart from '@/store/useShoppingCart';
import type { CartItem } from '../types';

export type RemoveFromCartInput = {
  productId: string;
  quantity?: number;
};

export type RemoveFromCartResult =
  | {
      success: true;
      productId: string;
      removedQuantity: number;
      lineRemoved: boolean;
      cart: CartItem[];
    }
  | { success: false; reason: 'not_in_cart' };

export function removeFromCart({
  productId,
  quantity,
}: RemoveFromCartInput): RemoveFromCartResult {
  const { cart, removeProductFromCart, decrementProductQuantity } =
    useShoppingCart.getState();

  const line = cart.find(p => p.id === productId);
  if (!line) {
    return { success: false, reason: 'not_in_cart' };
  }

  const currentQty = line.quantity;
  const requested = quantity ?? currentQty;
  const lineRemoved = requested >= currentQty;
  const removedQuantity = lineRemoved ? currentQty : requested;

  if (lineRemoved) {
    removeProductFromCart(productId);
  } else {
    for (let i = 0; i < removedQuantity; i += 1) {
      decrementProductQuantity(productId);
    }
  }

  return {
    success: true,
    productId,
    removedQuantity,
    lineRemoved,
    cart: useShoppingCart.getState().cart,
  };
}

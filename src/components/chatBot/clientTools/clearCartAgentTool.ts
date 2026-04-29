import useShoppingCart from '@/store/useShoppingCart';
import type { CartItem } from '../types';

export type ClearCartInput = Record<string, never>;

export type ClearCartResult = {
  success: true;
  removedLines: number;
  removedItems: number;
  alreadyEmpty: boolean;
  cart: CartItem[];
};

export function clearCart(): ClearCartResult {
  const { cart, emptyCart } = useShoppingCart.getState();

  const removedLines = cart.length;
  const removedItems = cart.reduce((acc, p) => acc + p.quantity, 0);
  const alreadyEmpty = removedLines === 0;

  if (!alreadyEmpty) {
    emptyCart();
  }

  return {
    success: true,
    removedLines,
    removedItems,
    alreadyEmpty,
    cart: useShoppingCart.getState().cart,
  };
}

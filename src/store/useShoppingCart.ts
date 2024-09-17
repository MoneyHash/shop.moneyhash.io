import { create } from 'zustand';
import { useMemo } from 'react';
import productSections, { type Product } from '@/utils/productSections';
import twoFixedDigit from '@/utils/twoFixedDigits';
import useCurrency from '@/store/useCurrency';

type State = {
  cart: (Product & { quantity: number })[];
};

type Action = {
  addProductToCart: (product: Product) => void;
  incrementProductQuantity: (productId: string) => void;
  decrementProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  resetCart: () => void;
  emptyCart: () => void;
};

const initialCart: State['cart'] = [
  ...productSections[0].products.slice(0, 1).map(p => ({ ...p, quantity: 1 })),
  ...productSections[1].products.slice(0, 2).map(p => ({ ...p, quantity: 1 })),
];

const useShoppingCart = create<State & Action>(set => ({
  cart: initialCart,
  addProductToCart: product => {
    set(state => {
      const productInCart = state.cart.find(p => p.id === product.id);
      if (productInCart) {
        return {
          cart: state.cart.map(p =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
          ),
        };
      }
      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    });
  },
  incrementProductQuantity: productId => {
    set(state => ({
      cart: state.cart.map(p =>
        p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
      ),
    }));
  },
  decrementProductQuantity: productId => {
    set(state => ({
      cart: state.cart.map(p =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
      ),
    }));
  },
  removeProductFromCart: productId => {
    set(state => ({
      cart: state.cart.filter(p => p.id !== productId),
    }));
  },
  resetCart: () => set({ cart: initialCart }),
  emptyCart: () => set({ cart: [] }),
}));

export default useShoppingCart;

export function useTotalPrice() {
  const currency = useCurrency(state => state.currency);
  const cart = useShoppingCart(state => state.cart);

  return useMemo(
    () =>
      cart.reduce(
        (acc, product) =>
          acc + twoFixedDigit(product.quantity * product.price[currency]),
        0,
      ),
    [cart, currency],
  );
}

import useShoppingCart from '@/store/useShoppingCart';
import { products } from './searchProductsAgentTool';

export type AddToCartInput = {
  productId: string;
  quantity?: number;
};

export type AddToCartResult =
  | {
      success: true;
      productId: string;
      quantity: number;
      cartTotalItems: number;
    }
  | { success: false; reason: 'unknown_product' };

export function addToCart({
  productId,
  quantity = 1,
}: AddToCartInput): AddToCartResult {
  const product = products.find(p => p.id === productId);
  if (!product) {
    return { success: false, reason: 'unknown_product' };
  }

  const { addProductToCart } = useShoppingCart.getState();
  for (let i = 0; i < quantity; i += 1) {
    addProductToCart(product);
  }

  const cartTotalItems = useShoppingCart
    .getState()
    .cart.reduce((acc, p) => acc + p.quantity, 0);

  return { success: true, productId, quantity, cartTotalItems };
}

import useCurrency from '../store/useCurrency';
import useShoppingCart from '../store/useShopingCart';
import type { Product } from '../utils/productSections';

type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  const { name, description, imageAlt, imageSrc, price } = product;
  const currency = useCurrency(state => state.currency);
  const addProductToCart = useShoppingCart(state => state.addProductToCart);

  return (
    <button type="button" onClick={() => addProductToCart(product)}>
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{price[currency]}</p>
        </div>
      </div>
    </button>
  );
}

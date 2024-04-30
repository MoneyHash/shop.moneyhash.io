import { useState } from 'react';
import useCurrency from '../store/useCurrency';
import ProductModal from './productModal';
import formatCurrency from '../utils/formatCurrency';

type ProductItemProps = {
  product: any;
};

export default function ProductItem({ product }: ProductItemProps) {
  const { name, description, imageAlt, imageSrc, price } = product;
  const [isOpen, setIsOpen] = useState(false);
  const currency = useCurrency(state => state.currency);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <div className="group relative">
          <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div className="text-left">
              <h3 className="text-sm text-gray-700">{name}</h3>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency({ amount: price[currency], currency })}
            </p>
          </div>
        </div>
      </button>
      <ProductModal
        product={product}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

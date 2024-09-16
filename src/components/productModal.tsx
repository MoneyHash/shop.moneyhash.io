import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { CheckIcon, StarIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import type { Product } from '@/utils/productSections';
import useCurrency from '@/store/useCurrency';
import useShoppingCart from '@/store/useShoppingCart';
import formatCurrency from '@/utils/formatCurrency';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const currency = useCurrency(state => state.currency);
  const addProductToCart = useShoppingCart(state => state.addProductToCart);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={isOpen => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
          <div className="h-80 sm:h-full w-fit mx-auto overflow-hidden rounded-lg sm:col-span-4 lg:col-span-5">
            <img
              src={product.imageSrc}
              alt={product.imageAlt}
              className="object-contain object-center w-full sm:object-cover h-full"
              draggable={false}
            />
          </div>

          <div className="sm:col-span-8 lg:col-span-7 h-full flex flex-col ">
            <DialogTitle>{product.name}</DialogTitle>

            <section aria-labelledby="information-heading" className="mt-4">
              <h3 id="information-heading" className="sr-only">
                Product information
              </h3>

              <div className="flex items-center">
                <DialogDescription>
                  {formatCurrency({
                    amount: product.price[currency],
                    currency,
                  })}
                </DialogDescription>

                <div className="ml-4 border-l pl-4">
                  <h4 className="sr-only">Reviews</h4>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map(rating => (
                        <StarIcon
                          key={rating}
                          className={clsx(
                            product.rating > rating
                              ? 'text-yellow-400'
                              : 'text-subtler',
                            'h-5 w-5 flex-shrink-0',
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{product.rating} out of 5 stars</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <CheckIcon
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                  aria-hidden="true"
                />
                <p className="ml-2 font-medium text-subtler">
                  In stock and ready to ship
                </p>
              </div>
            </section>

            <DialogFooter
              aria-labelledby="options-heading"
              className="pt-6 mt-auto"
            >
              <h3 id="options-heading" className="sr-only">
                Product options
              </h3>

              <div className="mt-auto flex flex-col w-full">
                <div className="mt-6">
                  <Button
                    className="shadow-none w-full"
                    onClick={() => {
                      addProductToCart(product);
                      onClose();
                    }}
                  >
                    Add to bag
                  </Button>
                </div>
                <div className="mt-4 text-center group flex items-center justify-center text-sm font-medium text-subtle hover:text-foreground">
                  <ShieldCheckIcon
                    className="mr-2 h-5 w-5 flex-shrink-0 "
                    aria-hidden="true"
                  />
                  <span>Lifetime Guarantee</span>
                </div>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

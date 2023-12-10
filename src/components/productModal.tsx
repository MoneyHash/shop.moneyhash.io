import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon, StarIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import type { Product } from '../utils/productSections';
import useCurrency from '../store/useCurrency';
import useShoppingCart from '../store/useShoppingCart';
import formatCurrency from '../utils/formatCurrency';

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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    <div className="h-full w-full overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7 h-full flex flex-col">
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                        {product.name}
                      </h2>

                      <section
                        aria-labelledby="information-heading"
                        className="mt-4"
                      >
                        <h3 id="information-heading" className="sr-only">
                          Product information
                        </h3>

                        <div className="flex items-center">
                          <p className="text-lg text-gray-900 sm:text-xl">
                            {formatCurrency({
                              amount: product.price[currency],
                              currency,
                            })}
                          </p>

                          <div className="ml-4 border-l border-gray-300 pl-4">
                            <h4 className="sr-only">Reviews</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map(rating => (
                                  <StarIcon
                                    key={rating}
                                    className={clsx(
                                      product.rating > rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300',
                                      'h-5 w-5 flex-shrink-0',
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">
                                {product.rating} out of 5 stars
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center">
                          <CheckIcon
                            className="h-5 w-5 flex-shrink-0 text-green-500"
                            aria-hidden="true"
                          />
                          <p className="ml-2 font-medium text-gray-500">
                            In stock and ready to ship
                          </p>
                        </div>
                      </section>

                      <section
                        aria-labelledby="options-heading"
                        className="pt-6 mt-auto"
                      >
                        <h3 id="options-heading" className="sr-only">
                          Product options
                        </h3>

                        <div className="mt-auto">
                          <div className="mt-6">
                            <button
                              type="submit"
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                              onClick={() => {
                                addProductToCart(product);
                                onClose();
                              }}
                            >
                              Add to bag
                            </button>
                          </div>
                          <div className="mt-6 text-center group flex justify-center text-base font-medium">
                            <ShieldCheckIcon
                              className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            <span className="text-gray-500 group-hover:text-gray-700">
                              Lifetime Guarantee
                            </span>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

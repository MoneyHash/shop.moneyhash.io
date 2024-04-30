import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import useShoppingCart from '../store/useShoppingCart';
import useCurrency from '../store/useCurrency';
import twoFixedDigit from '../utils/twoFixedDigits';
import formatCurrency from '../utils/formatCurrency';

export default function ShoppingCart() {
  const currency = useCurrency(state => state.currency);
  const {
    cart,
    removeProductFromCart,
    incrementProductQuantity,
    decrementProductQuantity,
  } = useShoppingCart(s => s);

  const totalProductsCount = useMemo(
    () => cart.reduce((acc, product) => acc + product.quantity, 0),
    [cart],
  );

  return (
    <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-3">
      <Popover.Button className="group -m-2 flex items-center p-2">
        <ShoppingBagIcon
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 tabular-nums">
          {totalProductsCount}
        </span>
        <span className="sr-only">items in cart, view bag</span>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-3 lg:w-96 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5 ">
          <h2 className="sr-only">Shopping Cart</h2>

          <div className="mx-auto max-w-2xl max-h-96 overflow-y-auto px-4">
            {cart.length === 0 && (
              <div className="flex flex-col items-center space-y-1 py-6">
                <ShoppingCartIcon className="w-10 h-10 text-gray-700" />
                <p className="mt-1 text-sm text-gray-600">Your Cart is Empty</p>
              </div>
            )}
            <ul className="divide-y divide-gray-200">
              {cart.map(product => (
                <li key={product.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p className="ml-4">
                          {formatCurrency({
                            currency,
                            amount: twoFixedDigit(
                              product.quantity * product.price[currency],
                            ),
                          })}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="text-gray-500 flex items-center space-x-1 border border-gray-200 rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => decrementProductQuantity(product.id)}
                          disabled={product.quantity === 1}
                          className="disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 enabled:hover:bg-gray-100 text-gray-800"
                        >
                          -
                        </button>
                        <span className="tabular-nums">
                          Qty {product.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementProductQuantity(product.id)}
                          className="px-2 py-1 hover:bg-gray-100 text-gray-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-primary-dark hover:text-primary"
                          onClick={() => removeProductFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 -mx-2 px-4 -mb-2 border-t border-t-slate-100">
            <Link
              to="/checkout"
              className={clsx(
                'block text-center w-full rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50',
                cart.length === 0 && 'pointer-events-none opacity-50',
              )}
            >
              Checkout
            </Link>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

import useShoppingCart from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';
import twoFixedDigit from '@/utils/twoFixedDigits';
import formatCurrency from '@/utils/formatCurrency';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

import { cn } from '@/utils/cn';

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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="shrink-0 px-2 py-1">
          <ShoppingBagIcon
            className="h-[1.2rem] w-[1.2rem] flex-shrink-0"
            aria-hidden="true"
          />
          <span className="ml-2 text-sm font-medium tabular-nums">
            {totalProductsCount}
          </span>
          <span className="sr-only">items in cart, view bag</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <h2 className="sr-only">Shopping Cart</h2>

        <div className="mx-auto max-w-2xl max-h-96 overflow-y-auto">
          <div className="px-4">
            {cart.length === 0 && (
              <div className="flex flex-col items-center space-y-1 py-6">
                <ShoppingCartIcon className="w-10 h-10" />
                <p className="mt-1 text-sm text-subtle">Your Cart is Empty</p>
              </div>
            )}
            <ul className="divide-y">
              {cart.map(product => (
                <li key={product.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium">
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
                      <p className="mt-1 text-sm text-subtle">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center space-x-1 border rounded-md text-foreground">
                        <button
                          type="button"
                          onClick={() => decrementProductQuantity(product.id)}
                          disabled={product.quantity === 1}
                          className="disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 enabled:hover:bg-muted"
                        >
                          -
                        </button>
                        <span className="tabular-nums text-subtle">
                          Qty {product.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementProductQuantity(product.id)}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex">
                        <Button
                          type="button"
                          onClick={() => removeProductFromCart(product.id)}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t p-4">
          <Button
            asChild
            className={cn(
              'w-full',
              cart.length === 0 && 'pointer-events-none opacity-50',
            )}
            size="lg"
          >
            <Link to="/checkout">Checkout</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

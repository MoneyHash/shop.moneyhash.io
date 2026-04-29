import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  Trash2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import useShoppingCart, { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';

export function CartView({ onBack }: { onBack: () => void }) {
  const cart = useShoppingCart(s => s.cart);
  const incrementProductQuantity = useShoppingCart(
    s => s.incrementProductQuantity,
  );
  const decrementProductQuantity = useShoppingCart(
    s => s.decrementProductQuantity,
  );
  const removeProductFromCart = useShoppingCart(s => s.removeProductFromCart);
  const currency = useCurrency(s => s.currency);
  const totalPrice = useTotalPrice();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onBack}
          aria-label="Back to chat"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <span className="text-sm font-semibold">Your Cart</span>
        {cart.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {cart.reduce((acc, p) => acc + p.quantity, 0)} items
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <ShoppingCartIcon className="size-10 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 px-4 py-3">
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className="size-14 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col flex-1 min-w-0 gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.color}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 flex-shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeProductFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6"
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeProductFromCart(item.id);
                            } else {
                              decrementProductQuantity(item.id);
                            }
                          }}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="size-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6"
                          onClick={() => incrementProductQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="size-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold">
                        {(item.price[currency] * item.quantity).toFixed(2)}{' '}
                        {currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>

      {cart.length > 0 && (
        <div className="border-t border-border/60 px-4 py-3 flex-shrink-0 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-base font-bold">
              {totalPrice.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

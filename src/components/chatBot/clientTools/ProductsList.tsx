import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import useShoppingCart from '@/store/useShoppingCart';
import type { Currency, Product } from './searchProductsAgentTool';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-amber-400 text-[10px] leading-none">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  currency,
}: {
  product: Product;
  currency: Currency;
}) {
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);
  const addProductToCart = useShoppingCart(s => s.addProductToCart);

  return (
    <div className="flex w-40 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-colors hover:border-primary/30">
      <img
        src={product.imageSrc}
        alt={product.imageAlt}
        className="h-28 w-full object-contain"
      />
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="truncate text-xs font-semibold leading-tight">
          {t(product.nameKey)}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {t(product.descriptionKey)}
        </p>
        <StarRating rating={product.rating} />
        <p className="mt-auto text-xs font-bold text-primary">
          {currency} {product.price[currency]}
        </p>
        <Button
          size="sm"
          className={`mt-1 h-7 w-full gap-1.5 text-[11px] transition-colors duration-200 ${
            added
              ? 'bg-green-500 hover:bg-green-500 text-white border-green-500'
              : ''
          }`}
          onClick={() => {
            if (added) return;
            addProductToCart(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
        >
          {added ? (
            <Check className="h-3 w-3" />
          ) : (
            <ShoppingCart className="h-3 w-3" />
          )}
          {added ? t('chatBot.tools.added') : t('chatBot.tools.addToCart')}
        </Button>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex w-40 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-2.5 w-2/5" />
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="mt-auto h-3 w-10" />
        <Skeleton className="mt-1 h-7 w-full" />
      </div>
    </div>
  );
}

export function ProductsListSkeleton() {
  return (
    <ScrollArea>
      <div className="flex gap-2.5 pb-1">
        {Array.from({ length: 2 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function ProductsList({
  products,
  currency,
}: {
  products: Product[];
  currency: Currency;
}) {
  const { t } = useTranslation();
  if (!products.length) {
    return (
      <p className="px-1 text-xs text-muted-foreground">
        {t('chatBot.tools.noProducts')}
      </p>
    );
  }

  return (
    <ScrollArea>
      <div className="flex gap-2.5 pb-1">
        {products.map(product => (
          <ProductCard key={product.id} product={product} currency={currency} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

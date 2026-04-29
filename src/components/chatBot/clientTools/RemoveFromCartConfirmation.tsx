import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from './searchProductsAgentTool';

export function RemoveFromCartConfirmation({
  productId,
  removedQuantity,
  lineRemoved,
  onViewCart,
}: {
  productId: string;
  removedQuantity: number;
  lineRemoved: boolean;
  onViewCart: () => void;
}) {
  const product = products.find(p => p.id === productId);
  if (!product) return null;

  return (
    <div className="flex w-fit max-w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-2.5">
      <img
        src={product.imageSrc}
        alt={product.imageAlt}
        className="h-14 w-14 flex-shrink-0 rounded-md object-contain"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[10px] font-medium text-destructive">
          <Trash2 className="h-3 w-3" />
          Removed from cart
        </div>
        <p className="truncate text-xs font-semibold leading-tight">
          {product.name}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {product.color} ·{' '}
          {lineRemoved ? 'Removed' : `Qty -${removedQuantity}`}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-7 gap-1.5 text-[11px]"
        onClick={onViewCart}
      >
        <ShoppingCart className="h-3 w-3" />
        View cart
      </Button>
    </div>
  );
}

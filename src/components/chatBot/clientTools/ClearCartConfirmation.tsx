import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ClearCartConfirmation({
  removedItems,
  removedLines,
  alreadyEmpty,
  onViewCart,
}: {
  removedItems: number;
  removedLines: number;
  alreadyEmpty: boolean;
  onViewCart: () => void;
}) {
  return (
    <div className="flex w-fit max-w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-2.5">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md bg-destructive/10">
        <Trash2 className="h-6 w-6 text-destructive" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[10px] font-medium text-destructive">
          <Trash2 className="h-3 w-3" />
          Cart cleared
        </div>
        <p className="truncate text-xs font-semibold leading-tight">
          {alreadyEmpty
            ? 'Your cart was already empty.'
            : 'All items removed.'}
        </p>
        {!alreadyEmpty && (
          <p className="truncate text-[10px] text-muted-foreground">
            {removedItems} item{removedItems === 1 ? '' : 's'} across{' '}
            {removedLines} product{removedLines === 1 ? '' : 's'}
          </p>
        )}
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

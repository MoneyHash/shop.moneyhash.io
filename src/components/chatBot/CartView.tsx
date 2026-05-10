import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  Sparkles,
  Trash2Icon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import useShoppingCart, { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';

const POPULAR_PICK_KEYS = ['shirts', 'bags', 'underHundred'] as const;

export function CartView({
  onBack,
  onPromptClick,
}: {
  onBack: () => void;
  onPromptClick?: (prompt: string) => void;
}) {
  const { t } = useTranslation();
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
          aria-label={t('chatBot.cartView.back')}
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        </Button>
        <span className="text-sm font-semibold">
          {t('chatBot.cartView.title')}
        </span>
        {cart.length > 0 && (
          <span className="ms-auto text-xs text-muted-foreground">
            {cart.reduce((acc, p) => acc + p.quantity, 0)}{' '}
            {t('chatBot.cartView.items')}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {cart.length === 0 ? (
            <div className="relative flex flex-col items-center px-6 pt-12 pb-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]"
              />

              <div className="relative flex h-32 w-32 items-center justify-center animate-in fade-in zoom-in-90 duration-700">
                <div className="absolute h-32 w-32 rounded-full bg-primary/[0.04] ring-1 ring-primary/[0.08]" />
                <div className="absolute h-24 w-24 rounded-full bg-primary/[0.07] ring-1 ring-primary/[0.12]" />
                <div className="absolute inset-0 [animation:spin_28s_linear_infinite]">
                  <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-primary/70 shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                </div>
                <div className="absolute inset-2 [animation:spin_22s_linear_infinite_reverse]">
                  <span className="absolute end-0 top-1/2 size-1 -translate-y-1/2 rounded-full bg-primary/50" />
                </div>
                <div className="absolute inset-1 [animation:spin_36s_linear_infinite]">
                  <span className="absolute bottom-1 start-2 size-1 rounded-full bg-primary/40" />
                </div>

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(259_85%_28%)] shadow-lg shadow-primary/30 ring-2 ring-primary/20 dark:from-primary/90 dark:to-transparent">
                  <ShoppingBagIcon
                    className="size-6 text-primary-foreground dark:text-foreground"
                    strokeWidth={2}
                  />
                  <span className="absolute -end-1 -top-1 flex size-4 items-center justify-center rounded-full bg-background ring-1 ring-border/60">
                    <span className="size-1.5 rounded-full bg-primary/80 [animation:pulse_2s_ease-in-out_infinite]" />
                  </span>
                </div>
              </div>

              <div className="mt-6 max-w-[260px] text-center animate-in fade-in slide-in-from-bottom-1 duration-500 delay-100 fill-mode-both">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                  {t('chatBot.cartView.empty.title')}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {t('chatBot.cartView.empty.description')}
                </p>
              </div>

              <Button
                size="sm"
                className="mt-5 h-9 gap-1.5 rounded-full px-5 text-xs font-medium shadow-sm shadow-primary/20 animate-in fade-in slide-in-from-bottom-1 duration-500 delay-150 fill-mode-both"
                onClick={onBack}
              >
                <Sparkles className="size-3.5" />
                {t('chatBot.cartView.empty.cta')}
              </Button>

              <div className="mt-8 w-full animate-in fade-in duration-500 delay-200 fill-mode-both">
                <div className="flex items-center gap-2.5">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border/60 rtl:bg-gradient-to-l" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                    {t('chatBot.cartView.empty.popularPicks')}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border/60 rtl:bg-gradient-to-r" />
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {POPULAR_PICK_KEYS.map(key => {
                    const label = t(
                      `chatBot.cartView.popularPicks.${key}.label`,
                    );
                    const prompt = t(
                      `chatBot.cartView.popularPicks.${key}.prompt`,
                    );
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (onPromptClick) {
                            onPromptClick(prompt);
                            onBack();
                          } else {
                            onBack();
                          }
                        }}
                        className="group relative h-7 overflow-hidden rounded-full border border-border/60 bg-card/40 px-3 text-[11px] font-medium text-foreground/80 transition-all hover:border-primary/40 hover:bg-primary/[0.06] hover:text-foreground hover:shadow-sm hover:shadow-primary/10"
                      >
                        <span className="relative z-10">{label}</span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-500 group-hover:translate-x-full rtl:translate-x-full rtl:bg-gradient-to-l rtl:group-hover:-translate-x-full" />
                      </button>
                    );
                  })}
                </div>
              </div>
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
                        aria-label={t('chatBot.cartView.removeItem')}
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
                          aria-label={t('chatBot.cartView.decreaseQuantity')}
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
                          aria-label={t('chatBot.cartView.increaseQuantity')}
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
            <span className="text-sm font-medium">
              {t('chatBot.cartView.total')}
            </span>
            <span className="text-base font-bold">
              {totalPrice.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

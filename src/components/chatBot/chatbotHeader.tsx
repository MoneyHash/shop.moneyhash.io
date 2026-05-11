import { useEffect, useRef, useState } from 'react';
import { Maximize2Icon, Minimize2Icon, XIcon } from 'lucide-react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { MoneyHashLogo } from '../moneyHashLogo';
import { Button } from '@/components/ui/button';
import useShoppingCart from '@/store/useShoppingCart';

export function ChatBotHeader({
  onClose,
  isExpanded,
  onToggleExpand,
  onCartClick,
}: {
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCartClick: () => void;
}) {
  const { t } = useTranslation();
  const cart = useShoppingCart(s => s.cart);
  const cartCount = cart.reduce((acc, p) => acc + p.quantity, 0);
  const [ripple, setRipple] = useState(false);
  const prevCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setRipple(true);
      const t = setTimeout(() => setRipple(false), 600);
      prevCountRef.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <div className="flex items-center justify-between p-3 border-b border-border/60 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <MoneyHashLogo className="size-4 text-primary" />
          <span className="absolute end-0 bottom-0 flex h-2 w-2 items-center justify-center rounded-full bg-background">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground leading-tight">
            {t('chatBot.header.title')}
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight">
            {t('chatBot.header.subtitle')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={`size-8 transition-colors duration-200 ${
              cartCount > 0 ? 'text-primary' : ''
            }`}
            aria-label={t('chatBot.header.cart')}
            onClick={onCartClick}
          >
            <ShoppingBagIcon className="size-4" />
          </Button>
          {cartCount > 0 && (
            <span
              className={`pointer-events-none absolute -top-0.5 -end-0.5 flex min-w-[16px] h-[16px] px-1 items-center justify-center rounded-full bg-primary text-[9px] font-bold leading-none text-primary-foreground ring-2 ring-background transition-transform duration-150 ${
                ripple ? 'scale-125' : 'scale-100'
              }`}
            >
              {ripple && (
                <span
                  className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"
                  style={{
                    animationIterationCount: 1,
                    animationDuration: '0.6s',
                  }}
                />
              )}
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>

        <Button
          onClick={onToggleExpand}
          variant="ghost"
          size="icon"
          className="size-8 max-sm:hidden"
          aria-label={
            isExpanded
              ? t('chatBot.header.collapse')
              : t('chatBot.header.expand')
          }
        >
          {isExpanded ? (
            <Minimize2Icon className="size-4" />
          ) : (
            <Maximize2Icon className="size-4" />
          )}
        </Button>

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={t('chatBot.header.close')}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

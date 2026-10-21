import { useState } from 'react';
import { CopyIcon, CreditCardIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

// Sandbox cards for demoing the checkout. The card fields are secure iframes we
// can't prefill, so we offer one-click copy instead.
const TEST_CARDS = [
  { number: '4242424242424242', outcome: 'success' },
  { number: '4734868958733862', outcome: 'failed' },
] as const;

const formatCardNumber = (number: string) =>
  number.replace(/(\d{4})(?=\d)/g, '$1 ');

export function TestCardsPopover() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={t('chatBot.testCards.title')}
            >
              <CreditCardIcon className="size-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          {t('chatBot.testCards.title')}
        </TooltipContent>
      </Tooltip>

      <PopoverContent align="end" className="w-64 p-2.5">
        <p className="px-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t('chatBot.testCards.title')}
        </p>
        <p className="mt-1 px-1.5 text-[11px] text-foreground/80">
          {t('chatBot.testCards.copyHint')}
        </p>
        <div className="mt-1.5 space-y-0.5">
          {TEST_CARDS.map(({ number, outcome }) => (
            <button
              key={number}
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(number);
                toast.success(t('chatBot.testCards.copied'));
                setOpen(false);
              }}
              className="group flex w-full items-center justify-between gap-2 rounded px-1.5 py-1.5 text-start transition-colors hover:bg-muted/60"
            >
              <code
                className="font-mono text-xs tabular-nums text-foreground/90 group-hover:text-foreground"
                dir="ltr"
              >
                {formatCardNumber(number)}
              </code>
              <span className="flex shrink-0 items-center gap-1.5">
                <span
                  className={cn(
                    'rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider',
                    outcome === 'success'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : 'bg-destructive/10 text-destructive',
                  )}
                >
                  {t(`chatBot.testCards.${outcome}`)}
                </span>
                <CopyIcon className="size-3 text-muted-foreground/60 group-hover:text-foreground" />
              </span>
            </button>
          ))}
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md bg-muted/50 px-2.5 py-2 text-[11px]">
          <dt className="text-muted-foreground">
            {t('chatBot.testCards.expiryLabel')}
          </dt>
          <dd className="font-medium text-foreground">
            {t('chatBot.testCards.expiryValue')}
          </dd>
          <dt className="text-muted-foreground">
            {t('chatBot.testCards.cvvLabel')}
          </dt>
          <dd className="font-medium text-foreground">
            {t('chatBot.testCards.cvvValue')}
          </dd>
        </dl>
      </PopoverContent>
    </Popover>
  );
}

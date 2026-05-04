import { useRef, useState } from 'react';
import {
  AlertCircleIcon,
  FingerprintIcon,
  LoaderIcon,
  SparklesIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

import useShoppingCart, { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';
import { useTheme } from '@/context/themeProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import createIntent from './createIntent';
import { verifyAgentAuthorization } from './agentAuthorization';
import type { CheckoutResult } from './result';

type Step = 'idle' | 'authorizing' | 'paying';

const SUCCESS_STATUSES = new Set(['CAPTURED', 'AUTHORIZED']);

export function MITCheckout({
  customerId,
  onComplete,
}: {
  customerId: string;
  onComplete: (result: CheckoutResult) => void;
}) {
  const cart = useShoppingCart(s => s.cart);
  const emptyCart = useShoppingCart(s => s.emptyCart);
  const currency = useCurrency(s => s.currency);
  const totalPrice = useTotalPrice();
  const { theme } = useTheme();

  const cartRef = useRef(cart);
  const currencyRef = useRef(currency);
  const totalRef = useRef(totalPrice);
  cartRef.current = cart;
  currencyRef.current = currency;
  totalRef.current = totalPrice;

  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finish = (result: CheckoutResult) => {
    if (result.status === 'success') emptyCart();
    onCompleteRef.current(result);
  };

  const handleConfirm = async () => {
    setError(null);
    setStep('authorizing');

    const authResult = await verifyAgentAuthorization(customerId);
    if (authResult.status !== 'authorized') {
      const message =
        authResult.status === 'unsupported'
          ? 'Biometric authorization is not available on this device'
          : authResult.reason || 'Authorization cancelled';
      setStep('idle');
      finish({ status: 'cancelled', message });
      return;
    }

    setStep('paying');
    try {
      const response = await createIntent({
        type: 'mit',
        customerId,
        backgroundColor: theme === 'dark' ? '%23000A14' : 'white',
        amount: totalRef.current,
        currency: currencyRef.current,
        productItems: cartRef.current.map(product => ({
          name: product.nameKey,
          description: product.descriptionKey,
          quantity: product.quantity,
          amount: product.price[currencyRef.current],
        })),
      });

      const {
        id,
        payment_status: paymentStatus,
        active_transaction: activeTransaction,
      } = response.data;

      if (SUCCESS_STATUSES.has(paymentStatus.status)) {
        const snapshotCurrency = currencyRef.current;
        finish({
          status: 'success',
          transactionId: activeTransaction?.id || id,
          currency: snapshotCurrency,
          total: totalRef.current,
          items: cartRef.current.map(p => ({
            id: p.id,
            name: p.name,
            color: p.color,
            imageSrc: p.imageSrc,
            imageAlt: p.imageAlt,
            quantity: p.quantity,
            price: p.price[snapshotCurrency],
          })),
        });
        return;
      }

      setStep('idle');
      finish({
        status: 'cancelled',
        message: `Payment was not completed (${paymentStatus.status})`,
      });
    } catch (err: any) {
      const errors = err?.response?.data?.status?.errors?.[0];
      if (errors) toast.error(Object.values(errors).join(', '));
      setStep('idle');
      setError('Could not complete the payment. Please try again.');
    }
  };

  const isWorking = step !== 'idle';

  return (
    <div
      data-fill-bubble
      aria-busy={isWorking}
      className="w-full overflow-hidden rounded-xl border border-emerald-500/30 bg-background shadow-sm"
    >
      <div className="flex items-center gap-2.5 bg-emerald-500/[0.06] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <SparklesIcon
            className="size-3.5 text-emerald-700 dark:text-emerald-400"
            strokeWidth={2.4}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-400/80">
            Agent authorized
          </p>
          <p className="truncate text-xs font-semibold text-foreground">
            One-tap checkout
          </p>
        </div>
      </div>

      <div
        className={cn(
          'space-y-2 px-3 py-3 transition-opacity',
          isWorking && 'pointer-events-none opacity-80',
        )}
      >
        <p className="text-[11px] leading-snug text-muted-foreground">
          Use the saved authorization on this device to charge your stored
          payment method. No card entry needed.
        </p>

        <div className="flex items-baseline justify-between rounded-md border border-dashed border-border/80 bg-muted/20 px-2.5 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Total
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {totalPrice.toFixed(2)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {currency}
            </span>
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/[0.06] px-2.5 py-1.5"
          >
            <AlertCircleIcon className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            <p className="text-[11px] font-medium leading-snug text-destructive">
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-stretch gap-2 border-t border-border/60 bg-muted/20 px-3 py-2.5">
        <Button
          onClick={handleConfirm}
          disabled={isWorking || cart.length === 0}
          className="group flex-1"
        >
          {step === 'authorizing' ? (
            <>
              <FingerprintIcon
                className="me-1.5 size-3.5 animate-pulse"
                strokeWidth={2.5}
              />
              Verifying...
            </>
          ) : step === 'paying' ? (
            <>
              <LoaderIcon className="me-1.5 size-3.5 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <FingerprintIcon className="me-1.5 size-3.5" strokeWidth={2.5} />
              Confirm purchase
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            finish({
              status: 'cancelled',
              message: 'User dismissed checkout',
            })
          }
          disabled={isWorking}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

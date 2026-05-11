import { useEffect, useRef, useState } from 'react';
import type { CardData, IntentDetails } from '@moneyhash/js-sdk/headless';
import {
  AlertCircleIcon,
  AppleIcon,
  FingerprintIcon,
  LoaderIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import createIntent from './createIntent';
import { moneyHash } from '@/utils/moneyHash';
import useShoppingCart, { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';
import { useTheme } from '@/context/themeProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import type { InfoFormValues } from '@/components/checkout/infoForm';

import { CardBrandStack, CardForm, CardFormSkeleton } from './cardForm';
import { IframeStep } from './iframeStep';
import { CheckoutResultBadge, type CheckoutResult } from './result';
import {
  readAgentAuthorization,
  verifyAgentAuthorization,
  type AgentAuthorizationResult,
} from './agentAuthorization';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'apple-pay-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          buttonstyle?: 'black' | 'white' | 'white-outline';
          type?:
            | 'plain'
            | 'buy'
            | 'set-up'
            | 'donate'
            | 'check-out'
            | 'book'
            | 'subscribe'
            | 'reload'
            | 'add-money'
            | 'top-up'
            | 'order'
            | 'rent'
            | 'support'
            | 'contribute'
            | 'tip';
          locale?: string;
        },
        HTMLElement
      >;
    }
  }
}

const DEMO_INFO: InfoFormValues = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone_number: '+966500000000',
  address: '123 King Fahd Rd',
  city: 'Riyadh',
  state: 'Riyadh',
  postal_code: '12345',
};

const SUCCESS_STATUSES = new Set(['CAPTURED', 'AUTHORIZED']);

type Step =
  | { kind: 'loading-methods' }
  | { kind: 'ready' }
  | { kind: 'apple-pay'; phase: 'sheet' | 'processing' }
  | { kind: 'card-paying' }
  | { kind: 'mit'; phase: 'authorizing' | 'paying' }
  | { kind: 'iframe-3ds'; intentId: string; url: string }
  | { kind: 'done'; result: CheckoutResult };

export function Checkout({
  customerId,
  paymentType,
  onComplete,
  onAgentAuthorized,
}: {
  customerId: string;
  paymentType?: 'card' | 'apple_pay';
  onComplete: (result: CheckoutResult) => void;
  onAgentAuthorized?: (result: AgentAuthorizationResult) => void;
}) {
  const { t, i18n } = useTranslation();
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

  const [step, setStep] = useState<Step>({ kind: 'loading-methods' });
  const [error, setError] = useState<string | null>(null);
  const [nativePayData, setNativePayData] = useState<Record<
    string,
    any
  > | null>(null);

  const isAgentAuthorized = !!readAgentAuthorization(customerId);
  const showApplePay = paymentType !== 'card';
  const showCard = paymentType !== 'apple_pay';

  useEffect(() => {
    if (!showApplePay) {
      setStep({ kind: 'ready' });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const response = await moneyHash.getMethods({
          currency: currencyRef.current,
          amount: totalRef.current,
          operation: 'purchase',
          customer: customerId,
        });
        if (cancelled) return;
        const applePay = response.expressMethods.find(
          m => m.id === 'APPLE_PAY',
        );
        setNativePayData(applePay?.nativePayData ?? null);
      } catch {
        // Silently ignore — we just won't show Apple Pay if the lookup fails.
      } finally {
        if (!cancelled) setStep({ kind: 'ready' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [customerId, showApplePay]);

  const buildProductItems = () =>
    cartRef.current.map(product => ({
      name: product.nameKey,
      description: product.descriptionKey,
      quantity: product.quantity,
      amount: product.price[currencyRef.current],
    }));

  const successResult = (transactionId: string): CheckoutResult => {
    const snapshotCurrency = currencyRef.current;
    return {
      status: 'success',
      transactionId,
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
    };
  };

  const finish = (result: CheckoutResult) => {
    setStep({ kind: 'done', result });
    if (result.status === 'success') emptyCart();
    onComplete(result);
  };

  const routeIntentDetails = (intentDetails: IntentDetails<'payment'>) => {
    const { paymentStatus, state, stateDetails, intent, transaction } =
      intentDetails;

    if (
      paymentStatus.status === 'CAPTURED' ||
      paymentStatus.status === 'AUTHORIZED'
    ) {
      if (transaction?.id) {
        finish(successResult(transaction.id));
      } else {
        finish({
          status: 'cancelled',
          message: t('chatBot.checkout.errors.unexpectedState'),
        });
      }
      return;
    }

    if (paymentStatus.status === 'AUTHORIZE_ATTEMPT_FAILED') {
      finish({
        status: 'cancelled',
        message: t('chatBot.checkout.errors.paymentDeclined'),
      });
      return;
    }

    if (
      state === 'CLOSED' ||
      state === 'EXPIRED' ||
      state === 'TRANSACTION_FAILED'
    ) {
      finish({
        status: 'cancelled',
        message: t('chatBot.checkout.errors.paymentIncomplete'),
      });
      return;
    }

    if (
      state === 'URL_TO_RENDER' &&
      stateDetails &&
      'url' in stateDetails &&
      stateDetails.url
    ) {
      setStep({
        kind: 'iframe-3ds',
        intentId: intent.id,
        url: stateDetails.url,
      });
      return;
    }

    finish({
      status: 'cancelled',
      message: t('chatBot.checkout.errors.unexpectedState'),
    });
  };

  const handleCardPay = async (cardData: CardData) => {
    setStep({ kind: 'card-paying' });
    setError(null);
    try {
      const response = await createIntent({
        type: 'cit',
        customerId,
        backgroundColor: theme === 'dark' ? '%23000A14' : 'white',
        amount: totalRef.current,
        currency: currencyRef.current,
        productItems: buildProductItems(),
      });
      const intentId = response.data.id;
      const intentDetails = await moneyHash.cardForm.pay({
        intentId,
        cardData,
        billingData: DEMO_INFO as unknown as Record<string, unknown>,
      });
      routeIntentDetails(intentDetails);
    } catch (err: any) {
      setStep({ kind: 'ready' });
      const errors = err?.response?.data?.status?.errors?.[0];
      if (errors) {
        toast.error(Object.values(errors).join(', '));
        setError(t('chatBot.checkout.errors.couldNotComplete'));
        return;
      }
      const firstField =
        err && typeof err === 'object'
          ? Object.values(err as Record<string, unknown>)[0]
          : err;
      setError(
        typeof firstField === 'string'
          ? firstField
          : t('chatBot.checkout.errors.paymentFailed'),
      );
    }
  };

  const handleMITConfirm = async () => {
    setError(null);
    setStep({ kind: 'mit', phase: 'authorizing' });

    const authResult = await verifyAgentAuthorization(customerId);
    if (authResult.status !== 'authorized') {
      const message =
        authResult.status === 'unsupported'
          ? t('chatBot.checkout.errors.biometricUnavailableShort')
          : authResult.reason ||
            t('chatBot.checkout.errors.authorizationCancelled');
      setStep({ kind: 'ready' });
      finish({ status: 'cancelled', message });
      return;
    }

    setStep({ kind: 'mit', phase: 'paying' });
    try {
      const response = await createIntent({
        type: 'mit',
        customerId,
        backgroundColor: theme === 'dark' ? '%23000A14' : 'white',
        amount: totalRef.current,
        currency: currencyRef.current,
        productItems: buildProductItems(),
      });

      const {
        id,
        payment_status: paymentStatus,
        active_transaction: activeTransaction,
      } = response.data;

      if (SUCCESS_STATUSES.has(paymentStatus.status)) {
        finish(successResult(activeTransaction?.id || id));
        return;
      }

      setStep({ kind: 'ready' });
      finish({
        status: 'cancelled',
        message: t('chatBot.checkout.errors.paymentNotCompleted', {
          status: paymentStatus.status,
        }),
      });
    } catch (err: any) {
      const errors = err?.response?.data?.status?.errors?.[0];
      if (errors) toast.error(Object.values(errors).join(', '));
      setStep({ kind: 'ready' });
      setError(t('chatBot.checkout.errors.couldNotComplete'));
    }
  };

  const handleApplePayClick = () => {
    if (!nativePayData) return;
    setError(null);

    let session: ApplePaySession;
    try {
      session = new ApplePaySession(3, {
        countryCode: nativePayData.country_code,
        currencyCode: nativePayData.currency_code,
        supportedNetworks: nativePayData.supported_networks,
        merchantCapabilities: nativePayData.supported_capabilities,
        total: {
          label: 'Apple Pay',
          type: 'final',
          amount: `${nativePayData.amount ?? totalRef.current}`,
        },
        requiredShippingContactFields: ['email'],
      });
    } catch {
      setError(t('chatBot.checkout.errors.applePayPaymentFailed'));
      return;
    }

    setStep({ kind: 'apple-pay', phase: 'sheet' });

    session.onvalidatemerchant = e => {
      moneyHash
        .validateApplePayMerchantSession({
          methodId: nativePayData.method_id,
          validationUrl: e.validationURL,
        })
        .then(merchantSession =>
          session.completeMerchantValidation(merchantSession),
        )
        .catch(() => {
          session.abort();
          setStep({ kind: 'ready' });
          setError(
            t('chatBot.checkout.errors.applePayMerchantValidationFailed'),
          );
        });
    };

    session.oncancel = () => {
      setStep({ kind: 'ready' });
    };

    session.onpaymentauthorized = async e => {
      const applePayReceipt = {
        receipt: JSON.stringify({ token: e.payment.token }),
        receiptBillingData: {
          email: e.payment.shippingContact?.emailAddress,
        },
      };
      session.completePayment(ApplePaySession.STATUS_SUCCESS);
      setStep({ kind: 'apple-pay', phase: 'processing' });

      try {
        const intentResponse = await createIntent({
          type: 'cit',
          customerId,
          backgroundColor: theme === 'dark' ? '%23000A14' : 'white',
          amount: totalRef.current,
          currency: currencyRef.current,
          productItems: buildProductItems(),
        });
        const intentId = intentResponse.data.id;

        await moneyHash.proceedWith({
          type: 'method',
          id: 'APPLE_PAY',
          intentId,
        });

        const intentDetails = await moneyHash.submitPaymentReceipt({
          nativeReceiptData: applePayReceipt,
          intentId,
        });

        const status = intentDetails.paymentStatus?.status;
        const transactionId =
          intentDetails.transaction?.id || intentDetails.intent.id;

        if (status && SUCCESS_STATUSES.has(status)) {
          finish(successResult(transactionId));
          return;
        }

        finish({
          status: 'cancelled',
          message: t('chatBot.checkout.errors.paymentNotCompleted', {
            status: status ?? 'UNKNOWN',
          }),
        });
      } catch (err: any) {
        const errors = err?.response?.data?.status?.errors?.[0];
        if (errors) toast.error(Object.values(errors).join(', '));
        setStep({ kind: 'ready' });
        setError(t('chatBot.checkout.errors.applePayPaymentFailed'));
      }
    };

    session.begin();
  };

  if (step.kind === 'loading-methods') {
    return <CardFormSkeleton />;
  }

  if (step.kind === 'iframe-3ds') {
    return (
      <IframeStep
        intentId={step.intentId}
        url={step.url}
        onIntentDetails={routeIntentDetails}
        onError={message => finish({ status: 'cancelled', message })}
      />
    );
  }

  if (step.kind === 'done') {
    return (
      <CheckoutResultBadge
        customerId={customerId}
        output={step.result}
        onAgentAuthorized={onAgentAuthorized}
      />
    );
  }

  const isWorking =
    step.kind === 'apple-pay' ||
    step.kind === 'card-paying' ||
    step.kind === 'mit';

  const onlyApplePay = paymentType === 'apple_pay';
  const showApplePayButton = showApplePay && !!nativePayData;
  const showDivider = showApplePayButton && showCard;

  return (
    <div
      data-fill-bubble
      aria-busy={isWorking}
      className={cn(
        'w-full overflow-hidden rounded-xl border bg-background shadow-sm',
        isAgentAuthorized && showCard
          ? 'border-emerald-500/30'
          : 'border-border/60',
      )}
    >
      <CheckoutHeader
        variant={
          onlyApplePay
            ? 'applePay'
            : isAgentAuthorized && showCard
            ? 'mit'
            : 'card'
        }
      />

      <div
        className={cn(
          'space-y-3 p-3 transition-opacity',
          isWorking && 'pointer-events-none opacity-80',
        )}
      >
        {showApplePayButton && (
          <ApplePayActionButton
            onClick={handleApplePayClick}
            disabled={isWorking}
            phase={step.kind === 'apple-pay' ? step.phase : 'idle'}
            theme={theme}
            language={i18n.language}
          />
        )}

        {showDivider && <OrDivider />}

        {showCard &&
          (isAgentAuthorized ? (
            <MITSection
              total={totalPrice}
              currency={currency}
              onConfirm={handleMITConfirm}
              disabled={isWorking || cart.length === 0}
              phase={step.kind === 'mit' ? step.phase : 'idle'}
            />
          ) : (
            <CardForm
              key={`${theme}-${i18n.language}`}
              onPay={handleCardPay}
              isSubmitting={step.kind === 'card-paying'}
            />
          ))}

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
          variant="ghost"
          className="flex-1"
          disabled={isWorking}
          onClick={() =>
            finish({
              status: 'cancelled',
              message: t('chatBot.checkout.errors.userDismissed'),
            })
          }
        >
          {t('chatBot.checkout.card.cancel')}
        </Button>
      </div>
    </div>
  );
}

function CheckoutHeader({ variant }: { variant: 'card' | 'mit' | 'applePay' }) {
  const { t } = useTranslation();

  if (variant === 'mit') {
    return (
      <div className="flex items-center gap-2.5 bg-emerald-500/[0.06] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <SparklesIcon
            className="size-3.5 text-emerald-700 dark:text-emerald-400"
            strokeWidth={2.4}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-400/80">
            {t('chatBot.checkout.mit.agentAuthorized')}
          </p>
          <p className="truncate text-xs font-semibold text-foreground">
            {t('chatBot.checkout.mit.oneTapCheckout')}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'applePay') {
    return (
      <div className="flex items-center gap-2.5 bg-foreground/[0.04] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 ring-1 ring-foreground/20">
          <AppleIcon className="size-3.5 text-foreground" strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t('chatBot.checkout.applePay.title')}
          </p>
          <p className="truncate text-xs font-semibold text-foreground">
            {t('chatBot.checkout.applePay.subtitle')}
          </p>
        </div>
        <ShieldCheckIcon
          className="size-3.5 text-muted-foreground/60"
          strokeWidth={2.2}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 bg-indigo-500/[0.06] px-3 py-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 ring-1 ring-indigo-500/30">
        <ShieldCheckIcon
          className="size-3.5 text-indigo-700 dark:text-indigo-400"
          strokeWidth={2.4}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-700/80 dark:text-indigo-400/80">
          {t('chatBot.checkout.card.secureCheckout')}
        </p>
        <p className="truncate text-xs font-semibold text-foreground">
          {t('chatBot.checkout.card.payWithCard')}
        </p>
      </div>
      <CardBrandStack />
    </div>
  );
}

function ApplePayActionButton({
  onClick,
  disabled,
  phase,
  theme,
  language,
}: {
  onClick: () => void;
  disabled: boolean;
  phase: 'idle' | 'sheet' | 'processing';
  theme: 'dark' | 'light' | 'system';
  language: string;
}) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLElement | null>(null);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  const isIdle = phase === 'idle';
  const interactive = isIdle && !disabled;

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || !interactive) return;
    const handler = () => onClickRef.current();
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [interactive]);

  if (!isIdle) {
    return (
      <Button
        type="button"
        disabled
        className="w-full bg-foreground text-background hover:bg-foreground/90"
      >
        <LoaderIcon className="me-1.5 size-3.5 animate-spin" />
        {phase === 'processing'
          ? t('chatBot.checkout.applePay.processing')
          : t('chatBot.checkout.applePay.preparing')}
      </Button>
    );
  }

  const buttonStyle = theme === 'dark' ? 'white' : 'black';
  const locale = language.startsWith('ar') ? 'ar-AB' : 'en-US';

  return (
    <div>
      <apple-pay-button
        ref={buttonRef}
        buttonstyle={buttonStyle}
        type="buy"
        locale={locale}
        aria-label={t('chatBot.checkout.applePay.button')}
        aria-disabled={disabled}
        style={
          {
            display: 'block',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            fontSize: 20,
            pointerEvents: disabled ? 'none' : 'auto',
            '--apple-pay-button-width': '100%',
            '--apple-pay-button-border-radius': '6px',
            '--apple-pay-button-padding': '0px 0px',
            '--apple-pay-button-box-sizing': 'border-box',
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function OrDivider() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-border/60" />
      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
        {t('chatBot.checkout.or')}
      </span>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}

function MITSection({
  total,
  currency,
  onConfirm,
  disabled,
  phase,
}: {
  total: number;
  currency: string;
  onConfirm: () => void;
  disabled: boolean;
  phase: 'idle' | 'authorizing' | 'paying';
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <p className="text-[11px] leading-snug text-muted-foreground">
        {t('chatBot.checkout.mit.explainer')}
      </p>

      <div className="flex items-baseline justify-between rounded-md border border-dashed border-border/80 bg-muted/20 px-2.5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t('chatBot.checkout.mit.total')}
        </span>
        <span className="flex items-baseline gap-1">
          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {total.toFixed(2)}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {currency}
          </span>
        </span>
      </div>

      <Button onClick={onConfirm} disabled={disabled} className="w-full">
        {phase === 'authorizing' ? (
          <>
            <FingerprintIcon
              className="me-1.5 size-3.5 animate-pulse"
              strokeWidth={2.5}
            />
            {t('chatBot.checkout.mit.verifying')}
          </>
        ) : phase === 'paying' ? (
          <>
            <LoaderIcon className="me-1.5 size-3.5 animate-spin" />
            {t('chatBot.checkout.mit.confirming')}
          </>
        ) : (
          <>
            <FingerprintIcon className="me-1.5 size-3.5" strokeWidth={2.5} />
            {t('chatBot.checkout.mit.confirmPurchase')}
          </>
        )}
      </Button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { Card, CardData, IntentDetails } from '@moneyhash/js-sdk/headless';
import {
  AlertCircleIcon,
  AppleIcon,
  CheckIcon,
  FingerprintIcon,
  LoaderIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import createIntent from './createIntent';
import createAgenticConsent, {
  type AgenticProduct,
} from './createAgenticConsent';
import { saveReceiptDraft } from './receiptDraft';
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

// The card-token webhook that links the tokenized card to the consent can lag a
// beat behind the CIT success, so the agentic service may briefly reject the
// passkey options request. Retry a few times before giving up.
const OPTIONS_RETRIES = 5;
const OPTIONS_RETRY_DELAY_MS = 1500;

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

type Consent = {
  consentId: string;
  intentId: string;
  products: AgenticProduct[];
  amount: string;
  currency: string;
};

type Step =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'apple-pay'; phase: 'sheet' | 'processing' }
  | { kind: 'card-paying' }
  | { kind: 'iframe-3ds'; intentId: string; url: string }
  | { kind: 'authorize'; phase: 'idle' | 'passkey' }
  | { kind: 'done'; result: CheckoutResult };

export function Checkout({
  customerId,
  paymentType,
  onComplete,
}: {
  customerId: string;
  paymentType?: 'card' | 'apple_pay';
  onComplete: (result: CheckoutResult) => void;
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

  const [step, setStep] = useState<Step>({ kind: 'loading' });
  const [error, setError] = useState<string | null>(null);
  const [nativePayData, setNativePayData] = useState<Record<
    string,
    any
  > | null>(null);
  const [savedCards, setSavedCards] = useState<Card[]>([]);

  // The agentic consent + zero-auth intent, created up front for the card flow.
  const consentRef = useRef<Consent | null>(null);

  const showApplePay = paymentType !== 'card';
  const showCard = paymentType !== 'apple_pay';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Fetch the customer's methods — saved cards (for the card flow) and the
        // Apple Pay express method.
        try {
          const response = await moneyHash.getMethods({
            currency: currencyRef.current,
            amount: totalRef.current,
            operation: 'purchase',
            customer: customerId,
          });
          if (cancelled) return;
          if (showCard) setSavedCards(response.savedCards ?? []);
          if (showApplePay) {
            const applePay = response.expressMethods.find(
              m => m.id === 'APPLE_PAY',
            );
            setNativePayData(applePay?.nativePayData ?? null);
          }
        } catch {
          // Non-fatal — fall back to new-card entry / no Apple Pay.
        }

        // The card flow authorizes the agent through an agentic consent.
        if (showCard) {
          const products = buildAgenticProducts();
          const consentCurrency = currencyRef.current;
          const amount = totalRef.current.toFixed(2);
          const { consentId, intentId } = await createAgenticConsent({
            customerId,
            currency: consentCurrency,
            products,
          });
          if (cancelled) return;
          consentRef.current = {
            consentId,
            intentId,
            products,
            amount,
            currency: consentCurrency,
          };
        }
      } catch {
        if (!cancelled) {
          setError(t('chatBot.checkout.errors.consentFailed'));
        }
      } finally {
        if (!cancelled) setStep({ kind: 'ready' });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, showApplePay, showCard]);

  const buildAgenticProducts = (): AgenticProduct[] =>
    cartRef.current.map(product => ({
      name: product.nameKey,
      amount: String(product.price[currencyRef.current]),
      qty: product.quantity,
    }));

  // Rich snapshot for the receipt UI (images, resolved names) — captured before
  // finish() empties the cart. The backend keys this by consentId and renders it
  // as the receipt for both immediate and deferred agentic charges.
  const buildReceiptItems = () => {
    const snapshotCurrency = currencyRef.current;
    return cartRef.current.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      imageSrc: p.imageSrc,
      imageAlt: p.imageAlt,
      quantity: p.quantity,
      price: p.price[snapshotCurrency],
    }));
  };

  const buildProductItems = () =>
    cartRef.current.map(product => ({
      name: product.nameKey,
      description: product.descriptionKey,
      quantity: product.quantity,
      amount: product.price[currencyRef.current],
    }));

  const successResult = (
    transactionId: string,
    paymentMethod: 'card' | 'apple_pay',
  ): CheckoutResult => {
    const snapshotCurrency = currencyRef.current;
    return {
      status: 'success',
      transactionId,
      currency: snapshotCurrency,
      total: totalRef.current,
      paymentMethod,
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
    if (result.status === 'success' || result.status === 'authorized') {
      emptyCart();
    }
    onComplete(result);
  };

  // Route the result of the zero-auth (CIT) card authorization. On success the
  // card is tokenized and we move on to the passkey / agent-authorization step.
  const routeCitDetails = (intentDetails: IntentDetails<'payment'>) => {
    const { paymentStatus, state, stateDetails, intent } = intentDetails;

    if (SUCCESS_STATUSES.has(paymentStatus.status)) {
      setError(null);
      setStep({ kind: 'authorize', phase: 'idle' });
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
    const consent = consentRef.current;
    if (!consent) {
      setError(t('chatBot.checkout.errors.consentFailed'));
      return;
    }

    setStep({ kind: 'card-paying' });
    setError(null);
    try {
      // The agentic consent intent has no preselected method — pick CARD, then
      // pay it to tokenize the new card (zero-auth CIT).
      await moneyHash.proceedWith({
        type: 'method',
        id: 'CARD',
        intentId: consent.intentId,
      });
      const intentDetails = await moneyHash.cardForm.pay({
        intentId: consent.intentId,
        cardData,
        billingData: DEMO_INFO as unknown as Record<string, unknown>,
      });
      routeCitDetails(intentDetails);
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

  const handleSavedCardPay = async (cardId: string, cvv: string) => {
    const consent = consentRef.current;
    if (!consent) {
      setError(t('chatBot.checkout.errors.consentFailed'));
      return;
    }

    setStep({ kind: 'card-paying' });
    setError(null);
    try {
      // Pay the zero-auth intent with a saved card, passing the CVV as metadata.
      const intentDetails = await moneyHash.proceedWith({
        type: 'savedCard',
        id: cardId,
        intentId: consent.intentId,
        metaData: { cvv },
      });
      routeCitDetails(intentDetails);
    } catch (err: any) {
      setStep({ kind: 'ready' });
      const errors = err?.response?.data?.status?.errors?.[0];
      if (errors) {
        toast.error(Object.values(errors).join(', '));
        setError(t('chatBot.checkout.errors.couldNotComplete'));
        return;
      }
      setError(t('chatBot.checkout.errors.paymentFailed'));
    }
  };

  const generateOptionsWithRetry = async (consentId: string) => {
    let lastError: unknown;
    for (let attempt = 0; attempt < OPTIONS_RETRIES; attempt += 1) {
      try {
        // Sequential by design — retry only after the previous attempt settles.
        // eslint-disable-next-line no-await-in-loop
        return await moneyHash.agentic.generatePassKeyOptions({ consentId });
      } catch (err) {
        lastError = err;
        // eslint-disable-next-line no-await-in-loop
        if (attempt < OPTIONS_RETRIES - 1) await wait(OPTIONS_RETRY_DELAY_MS);
      }
    }
    throw lastError;
  };

  // Ask the customer to authorize the agent with a passkey. Once the consent is
  // AUTHORIZED we hand back to the agent — it executes the payment itself with a
  // server-side tool, so the frontend does not run the charge.
  const handleAuthorizeAgent = async () => {
    const consent = consentRef.current;
    if (!consent) {
      setError(t('chatBot.checkout.errors.consentFailed'));
      return;
    }

    setError(null);
    setStep({ kind: 'authorize', phase: 'passkey' });

    try {
      const options = await generateOptionsWithRetry(consent.consentId);
      const credential = await moneyHash.agentic.authenticatePassKey(options);
      if (!credential) {
        setStep({ kind: 'authorize', phase: 'idle' });
        setError(t('chatBot.checkout.errors.passkeyCancelled'));
        return;
      }
      await moneyHash.agentic.verifyPassKeyAuthentication({
        consentId: consent.consentId,
        credential,
      });

      // Capture the receipt snapshot before finish() empties the cart. The
      // backend renders it as the receipt once the agent executes the charge
      // (immediately, or later for a deferred charge). Fire-and-forget.
      saveReceiptDraft({
        consentId: consent.consentId,
        customerId,
        currency: consent.currency,
        total: totalRef.current,
        items: buildReceiptItems(),
      });
    } catch (err: any) {
      setStep({ kind: 'authorize', phase: 'idle' });
      if (
        err instanceof Error &&
        (err.name === 'NotAllowedError' || err.name === 'AbortError')
      ) {
        setError(t('chatBot.checkout.errors.passkeyCancelled'));
        return;
      }
      setError(t('chatBot.checkout.errors.passkeyFailed'));
      return;
    }

    // Consent is authorized — report it back so the agent completes the payment.
    finish({
      status: 'authorized',
      consentId: consent.consentId,
      amount: consent.amount,
      currency: consent.currency,
      total: totalRef.current,
      products: consent.products,
    });
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
          type: 'apple_pay',
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
          finish(successResult(transactionId, 'apple_pay'));
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

  if (step.kind === 'loading') {
    return <CardFormSkeleton />;
  }

  if (step.kind === 'iframe-3ds') {
    return (
      <IframeStep
        intentId={step.intentId}
        url={step.url}
        onIntentDetails={routeCitDetails}
        onError={message => finish({ status: 'cancelled', message })}
      />
    );
  }

  if (step.kind === 'done') {
    return <CheckoutResultBadge output={step.result} />;
  }

  const isWorking =
    step.kind === 'apple-pay' ||
    step.kind === 'card-paying' ||
    (step.kind === 'authorize' && step.phase !== 'idle');

  const onlyApplePay = paymentType === 'apple_pay';
  const showApplePayButton = showApplePay && !!nativePayData;
  const inAuthorizeStep = step.kind === 'authorize';
  const showDivider = showApplePayButton && showCard && !inAuthorizeStep;

  return (
    <div
      data-fill-bubble
      aria-busy={isWorking}
      className={cn(
        'w-full overflow-hidden rounded-xl border bg-background shadow-sm',
        inAuthorizeStep ? 'border-emerald-500/30' : 'border-border/60',
      )}
    >
      <CheckoutHeader
        variant={inAuthorizeStep ? 'agent' : onlyApplePay ? 'applePay' : 'card'}
      />

      <div
        className={cn(
          'space-y-3 p-3 transition-opacity',
          isWorking && 'pointer-events-none opacity-80',
        )}
      >
        {inAuthorizeStep ? (
          <AuthorizeAgentSection
            total={totalPrice}
            currency={currency}
            onAuthorize={handleAuthorizeAgent}
            phase={step.phase}
          />
        ) : (
          <>
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

            {showCard && (
              <CardPaymentSection
                key={`${theme}-${i18n.language}`}
                savedCards={savedCards}
                onPaySaved={handleSavedCardPay}
                onPayNew={handleCardPay}
                isSubmitting={step.kind === 'card-paying'}
              />
            )}
          </>
        )}

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

function CheckoutHeader({
  variant,
}: {
  variant: 'card' | 'agent' | 'applePay';
}) {
  const { t } = useTranslation();

  if (variant === 'agent') {
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
            {t('chatBot.checkout.agentic.authorizeTitle')}
          </p>
          <p className="truncate text-xs font-semibold text-foreground">
            {t('chatBot.checkout.agentic.authorizeSubtitle')}
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

function AuthorizeAgentSection({
  total,
  currency,
  onAuthorize,
  phase,
}: {
  total: number;
  currency: string;
  onAuthorize: () => void;
  phase: 'idle' | 'passkey';
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <p className="text-[11px] leading-snug text-muted-foreground">
        {t('chatBot.checkout.agentic.authorizeExplainer')}
      </p>

      <div className="flex items-baseline justify-between rounded-md border border-dashed border-border/80 bg-muted/20 px-2.5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t('chatBot.checkout.agentic.total')}
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

      <Button
        onClick={onAuthorize}
        disabled={phase !== 'idle'}
        className="w-full"
      >
        {phase === 'passkey' ? (
          <>
            <FingerprintIcon
              className="me-1.5 size-3.5 animate-pulse"
              strokeWidth={2.5}
            />
            {t('chatBot.checkout.agentic.verifying')}
          </>
        ) : (
          <>
            <FingerprintIcon className="me-1.5 size-3.5" strokeWidth={2.5} />
            {t('chatBot.checkout.agentic.authorizeCta')}
          </>
        )}
      </Button>
    </div>
  );
}

// Lets the customer pay the CIT with a saved card (tabs → card tiles + CVV) or
// a new card.
function CardPaymentSection({
  savedCards,
  onPaySaved,
  onPayNew,
  isSubmitting,
}: {
  savedCards: Card[];
  onPaySaved: (cardId: string, cvv: string) => void;
  onPayNew: (cardData: CardData) => Promise<void>;
  isSubmitting: boolean;
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'saved' | 'new'>(
    savedCards.length ? 'saved' : 'new',
  );
  const [selected, setSelected] = useState<string>(savedCards[0]?.id ?? '');
  const [cvv, setCvv] = useState('');

  // No saved cards → straight to new-card entry, no tabs.
  if (!savedCards.length) {
    return <CardForm onPay={onPayNew} isSubmitting={isSubmitting} />;
  }

  const selectedCard = savedCards.find(c => c.id === selected);
  const cvvValid = cvv.length >= 3;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/40 p-1">
        {(['saved', 'new'] as const).map(key => (
          <button
            key={key}
            type="button"
            disabled={isSubmitting}
            onClick={() => setTab(key)}
            className={cn(
              'rounded-md py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-60',
              tab === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {key === 'saved'
              ? t('chatBot.checkout.card.savedCards')
              : t('chatBot.checkout.card.newCard')}
          </button>
        ))}
      </div>

      {tab === 'saved' ? (
        <div className="space-y-2.5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {savedCards.map(card => (
              <SavedCardTile
                key={card.id}
                card={card}
                selected={selected === card.id}
                disabled={isSubmitting}
                onSelect={() => setSelected(card.id)}
              />
            ))}
          </div>

          <div className="flex items-end gap-2">
            <label className="shrink-0">
              <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {t('chatBot.checkout.card.cvv')}
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                placeholder="•••"
                disabled={isSubmitting}
                className="h-9 w-16 rounded-md border border-border/60 bg-background text-center font-mono text-sm tabular-nums tracking-widest text-foreground outline-none ring-primary/30 transition placeholder:tracking-normal focus:border-primary/50 focus:ring-2"
              />
            </label>
            <Button
              className="h-9 flex-1"
              disabled={isSubmitting || !cvvValid || !selectedCard}
              onClick={() => selectedCard && onPaySaved(selectedCard.id, cvv)}
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="me-1.5 size-3.5 animate-spin" />
                  {t('chatBot.checkout.card.processing')}
                </>
              ) : (
                t('chatBot.checkout.card.addCard')
              )}
            </Button>
          </div>
        </div>
      ) : (
        <CardForm onPay={onPayNew} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}

function SavedCardTile({
  card,
  selected,
  disabled,
  onSelect,
}: {
  card: Card;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'relative flex h-24 w-40 shrink-0 flex-col justify-between rounded-xl border bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 p-3 text-left transition-all disabled:opacity-60',
        selected
          ? 'border-primary/60 ring-2 ring-primary/30'
          : 'border-border/60 hover:border-border',
      )}
    >
      <span className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide text-foreground">
          {card.brand}
        </span>
        {selected && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon className="size-3" strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="block">
        <span className="block font-mono text-xs tracking-widest text-foreground">
          •••• {card.last4}
        </span>
        <span className="block font-mono text-[10px] tabular-nums text-muted-foreground">
          {card.expiryMonth}/{card.expiryYear}
        </span>
      </span>
    </button>
  );
}

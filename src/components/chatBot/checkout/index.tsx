import { useEffect, useRef, useState } from 'react';
import type { IntentDetails } from '@moneyhash/js-sdk/headless';
import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';
import createIntent from './createIntent';
import { moneyHash } from '@/utils/moneyHash';
import useShoppingCart, { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';
import { useTheme } from '@/context/themeProvider';
import { Button } from '@/components/ui/button';
import type { InfoFormValues } from '@/components/checkout/infoForm';

import { CardForm, CardFormSkeleton } from './cardForm';
import { IframeStep } from './iframeStep';
import { CheckoutResultBadge, type CheckoutResult } from './result';
import type { AgentAuthorizationResult } from './agentAuthorization';

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

type Step =
  | { kind: 'creating-intent' }
  | { kind: 'card-form'; intentId: string }
  | { kind: 'iframe-3ds'; intentId: string; url: string }
  | { kind: 'done'; result: CheckoutResult };

export function Checkout({
  customerId,
  onComplete,
  onAgentAuthorized,
}: {
  customerId: string;
  onComplete: (result: CheckoutResult) => void;
  onAgentAuthorized?: (result: AgentAuthorizationResult) => void;
}) {
  const cart = useShoppingCart(s => s.cart);
  const emptyCart = useShoppingCart(s => s.emptyCart);
  const currency = useCurrency(s => s.currency);
  const totalPrice = useTotalPrice();
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  const [step, setStep] = useState<Step>({ kind: 'creating-intent' });
  const [createError, setCreateError] = useState<string | null>(null);

  const cartRef = useRef(cart);
  const currencyRef = useRef(currency);
  const totalRef = useRef(totalPrice);
  cartRef.current = cart;
  currencyRef.current = currency;
  totalRef.current = totalPrice;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await createIntent({
          type: 'cit',
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
        const intentId = response.data.id;
        await moneyHash.getIntentDetails(intentId);
        if (cancelled) return;
        setStep({ kind: 'card-form', intentId });
      } catch (err: any) {
        if (cancelled) return;
        const errors = err?.response?.data?.status?.errors?.[0];
        if (errors) {
          toast.error(Object.values(errors).join(', '));
        }

        setCreateError('Could not start checkout. Please try again.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [theme, customerId]);

  const finish = (result: CheckoutResult) => {
    setStep({ kind: 'done', result });
    if (result.status === 'success') {
      emptyCart();
    }
    onComplete(result);
  };

  const routeIntentDetails = (intentDetails: IntentDetails<'payment'>) => {
    const { paymentStatus, state, stateDetails, intent, transaction } =
      intentDetails;

    if (
      paymentStatus.status === 'CAPTURED' ||
      paymentStatus.status === 'AUTHORIZED'
    ) {
      const snapshotCurrency = currencyRef.current;
      finish({
        status: 'success',
        transactionId: transaction?.id || intent.id,
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

    if (paymentStatus.status === 'AUTHORIZE_ATTEMPT_FAILED') {
      finish({ status: 'cancelled', message: 'Payment was declined' });
      return;
    }

    if (
      state === 'CLOSED' ||
      state === 'EXPIRED' ||
      state === 'TRANSACTION_FAILED'
    ) {
      finish({
        status: 'cancelled',
        message: 'Payment could not be completed',
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

    finish({ status: 'cancelled', message: 'Unexpected payment state' });
  };

  if (createError) {
    return (
      <div
        data-fill-bubble
        className="flex w-full flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/[0.06] p-3"
      >
        <p className="text-xs font-medium text-destructive">{createError}</p>
        <Button
          size="sm"
          variant="outline"
          className="self-start"
          onClick={() =>
            onComplete({ status: 'cancelled', message: createError })
          }
        >
          Dismiss
        </Button>
      </div>
    );
  }

  if (step.kind === 'creating-intent') {
    return <CardFormSkeleton />;
  }

  if (step.kind === 'card-form') {
    return (
      <CardForm
        key={`${theme}-${i18n.language}`}
        intentId={step.intentId}
        billingData={DEMO_INFO}
        onPaymentResult={routeIntentDetails}
        onCancel={() =>
          finish({ status: 'cancelled', message: 'User dismissed checkout' })
        }
      />
    );
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

  return (
    <CheckoutResultBadge
      customerId={customerId}
      output={step.result}
      onAgentAuthorized={onAgentAuthorized}
    />
  );
}

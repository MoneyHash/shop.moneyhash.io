import {
  PaymentStatus,
  type IntentDetails,
  type IntentState,
} from '@moneyhash/js-sdk/headless';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { type PaymentMethodSlugs } from '@moneyhash/js-sdk';
import useConfiguration from '@/store/useConfiguration';
import { UrlToRender } from './urlToRender';
import { CardForm } from './cardForm';
import { IntentForm } from './intentForm';

type StateDetails = IntentDetails<'payment'>['stateDetails'];

export function IntentStateRenderer({
  intentId,
  state,
  stateDetails,
  onIntentDetailsChange,
  paymentMethod,
  paymentStatus,
}: {
  intentId: string;
  state: IntentState;
  stateDetails: StateDetails;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
  paymentMethod: PaymentMethodSlugs;
  paymentStatus: PaymentStatus;
}) {
  const { cardForm, fontFamily } = useConfiguration(
    useShallow(({ cardForm, fontFamily }) => ({ cardForm, fontFamily })),
  );

  if (state === 'INTENT_FORM') {
    return (
      <IntentForm
        intentId={intentId}
        onIntentDetailsChange={onIntentDetailsChange}
      />
    );
  }

  if (
    paymentStatus.status === 'CAPTURED' ||
    paymentStatus.status === 'AUTHORIZED' ||
    paymentStatus.status === 'AUTHORIZE_ATTEMPT_FAILED'
  ) {
    return <Navigate replace to={`/checkout/order?intent_id=${intentId}`} />;
  }

  if (state === 'URL_TO_RENDER' && stateDetails && 'url' in stateDetails)
    return (
      <UrlToRender
        intentId={intentId}
        {...stateDetails}
        onIntentDetailsChange={onIntentDetailsChange}
      />
    );

  if (state === 'FORM_FIELDS' && stateDetails && 'formFields' in stateDetails)
    return (
      <CardForm
        key={`${cardForm}-${fontFamily}`}
        intentId={intentId}
        paymentMethod={paymentMethod}
        accessToken={stateDetails.formFields.card?.accessToken!}
        onIntentDetailsChange={onIntentDetailsChange}
        billingFields={stateDetails.formFields.billing}
      />
    );
}

import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

import useConfiguration from '@/store/useConfiguration';
import { UrlToRender } from './urlToRender';
import { CardForm, Click2PayCardForm } from './cardForm';
import { IntentForm } from './intentForm';
import { InstallmentPlans } from './installmentPlans';
import { ExpiredState } from './expiredState';
import { type InfoFormValues } from '../infoForm';

export function IntentStateRenderer({
  intentDetails,
  paymentMethod,
  onIntentDetailsChange,
  isSubscription = false,
  isInstallment = false,
  click2payNativeData = null,
  userInfo,
  createClick2PayIntent,
}: {
  intentDetails?: IntentDetails<'payment'> | null;
  paymentMethod: string | null;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
  isSubscription?: boolean;
  isInstallment?: boolean;
  click2payNativeData?: Record<string, any> | null;
  userInfo?: InfoFormValues;
  createClick2PayIntent?: (
    methodId: string,
    customFields?: Record<string, any>,
  ) => Promise<string>;
}) {
  const { state, stateDetails, paymentStatus } = intentDetails || {};
  const intentId = intentDetails?.intent.id;

  const { t } = useTranslation();
  const { cardForm, fontFamily } = useConfiguration(
    useShallow(({ cardForm, fontFamily }) => ({ cardForm, fontFamily })),
  );

  if (
    paymentStatus?.status === 'CAPTURED' ||
    paymentStatus?.status === 'AUTHORIZED' ||
    paymentStatus?.status === 'AUTHORIZE_ATTEMPT_FAILED'
  ) {
    return <Navigate replace to={`/checkout/order?intent_id=${intentId}`} />;
  }

  if (state === 'EXPIRED') {
    return <ExpiredState />;
  }

  if (
    state === 'URL_TO_RENDER' &&
    intentId &&
    stateDetails &&
    'url' in stateDetails
  )
    return (
      <UrlToRender
        intentId={intentId}
        {...stateDetails}
        onIntentDetailsChange={onIntentDetailsChange}
      />
    );

  if (
    paymentMethod === 'C2P-CARD' &&
    click2payNativeData &&
    userInfo &&
    createClick2PayIntent
  ) {
    return (
      <Click2PayCardForm
        key={`${cardForm}-${fontFamily}`}
        click2payNativeData={click2payNativeData}
        onIntentDetailsChange={onIntentDetailsChange}
        userInfo={userInfo}
        createClick2PayIntent={createClick2PayIntent}
      />
    );
  }

  if (
    state === 'FORM_FIELDS' &&
    intentId &&
    stateDetails &&
    'formFields' in stateDetails
  )
    return (
      <div>
        {isInstallment && (
          <p className="px-2 pt-4 text-sm text-muted-foreground text-center">
            {t('payment.enterCardForPlans')}
          </p>
        )}

        <CardForm
          key={`${cardForm}-${fontFamily}`}
          intentId={intentId}
          paymentMethod={paymentMethod!}
          accessToken={stateDetails.formFields.card?.accessToken!}
          onIntentDetailsChange={onIntentDetailsChange}
          billingFields={stateDetails.formFields.billing}
          isSubscription={isSubscription}
        />
      </div>
    );

  if (state === 'INTENT_FORM' && intentId) {
    return (
      <IntentForm
        intentId={intentId}
        onIntentDetailsChange={onIntentDetailsChange}
      />
    );
  }

  if (
    state === 'INSTALLMENT_PLANS' &&
    stateDetails &&
    intentId &&
    'plans' in stateDetails
  ) {
    return (
      <InstallmentPlans
        intentId={intentId}
        {...stateDetails}
        onIntentDetailsChange={onIntentDetailsChange}
      />
    );
  }
}

import {
  type IntentDetails,
  type IntentState,
} from '@moneyhash/js-sdk/headless';
import { Navigate } from 'react-router-dom';

import { UrlToRender } from './urlToRender';
import { CardForm } from './cardForm';

type StateDetails = IntentDetails<'payment'>['stateDetails'];

export function IntentStateRenderer({
  intentId,
  state,
  stateDetails,
  onIntentDetailsChange,
}: {
  intentId: string;
  state: IntentState;
  stateDetails: StateDetails;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
}) {
  if (!stateDetails) {
    return <Navigate replace to={`/checkout/order?intent_id=${intentId}`} />;
  }

  if (state === 'URL_TO_RENDER' && 'url' in stateDetails)
    return <UrlToRender intentId={intentId} {...stateDetails} />;

  if (state === 'FORM_FIELDS' && 'formFields' in stateDetails)
    return (
      <CardForm
        intentId={intentId}
        accessToken={stateDetails.formFields.card?.accessToken!}
        onIntentDetailsChange={onIntentDetailsChange}
      />
    );
}

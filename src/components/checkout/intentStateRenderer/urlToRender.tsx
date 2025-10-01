import { useEffect } from 'react';
import {
  IntentDetails,
  type IntentStateDetails,
} from '@moneyhash/js-sdk/headless';

import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';
import { useCallbackRef } from '@/hooks/useCallbackRef';
import { useMoneyHash } from '@/context/moneyHashProvider';

export function UrlToRender({
  intentId,
  url,
  renderStrategy,
  onIntentDetailsChange,
}: {
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
} & IntentStateDetails<'URL_TO_RENDER'>) {
  const onIntentDetailsChangeRef = useCallbackRef(onIntentDetailsChange);
  const moneyHash = useMoneyHash();
  useEffect(() => {
    moneyHash
      .renderUrl({
        intentId,
        renderStrategy:
          renderStrategy === 'IFRAME' ? 'REDIRECT' : renderStrategy,
        url,
      })
      .then(onIntentDetailsChangeRef);
  }, [intentId, url, renderStrategy, onIntentDetailsChangeRef, moneyHash]);

  if (renderStrategy === 'POPUP_IFRAME')
    return (
      <div className="p-4 flex gap-3">
        <Button
          size="sm"
          onClick={() =>
            moneyHash
              .renderUrl({
                intentId,
                renderStrategy,
                url,
              })
              .then(onIntentDetailsChangeRef)
          }
        >
          Continue payment
        </Button>
        <p className="text-xs text-subtle">
          A new window should be open to continue your payment if it didn&apos;t
          open please click the button.
        </p>
      </div>
    );

  if (renderStrategy === 'IFRAME') {
    return <div className="h-96" id="rendered-url-iframe-container" />;
  }

  return (
    <div className="h-96 bg-black/30 flex items-center justify-center">
      <Loader />
    </div>
  );
}

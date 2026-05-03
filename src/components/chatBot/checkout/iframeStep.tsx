import { useEffect } from 'react';
import type { IntentDetails } from '@moneyhash/js-sdk/headless';

import { moneyHash } from '@/utils/moneyHash';

const CONTAINER_ID = 'rendered-url-iframe-container';

export function IframeStep({
  intentId,
  url,
  onIntentDetails,
  onError,
}: {
  intentId: string;
  url: string;
  onIntentDetails: (intentDetails: IntentDetails<'payment'>) => void;
  onError: (message: string) => void;
}) {
  useEffect(() => {
    let cancelled = false;
    moneyHash
      .renderUrl({ intentId, url, renderStrategy: 'IFRAME' })
      .then(intentDetails => {
        if (!cancelled) onIntentDetails(intentDetails);
      })
      .catch(err => {
        if (!cancelled) {
          const message =
            (err && typeof err === 'object' && 'message' in err
              ? String((err as { message: unknown }).message)
              : null) || 'Authentication failed';
          onError(message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [intentId, url, onIntentDetails, onError]);

  return (
    <div
      data-fill-bubble
      id={CONTAINER_ID}
      className="h-[440px] w-full overflow-hidden rounded"
    />
  );
}

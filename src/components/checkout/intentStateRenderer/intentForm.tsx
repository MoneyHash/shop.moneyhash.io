import { useEffect, useRef } from 'react';
import type { IntentDetails } from '@moneyhash/js-sdk/headless';
import { moneyHash } from '@/utils/moneyHash';
import { useCallbackRef } from '@/hooks/useCallbackRef';

export function IntentForm({
  intentId,
  onIntentDetailsChange,
}: {
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const onIntentDetailsChangeRef = useCallbackRef(onIntentDetailsChange);
  useEffect(() => {
    moneyHash
      .renderForm({
        selector: '#moneyHash-intent-form',
        intentId,
      })
      .then(onIntentDetailsChangeRef);
  }, [intentId, onIntentDetailsChangeRef]);

  return <div ref={containerRef} id="moneyHash-intent-form" className="h-96" />;
}

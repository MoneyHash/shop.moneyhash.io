import { useEffect, useRef } from 'react';
import type { IntentDetails } from '@moneyhash/js-sdk/headless';
import { useCallbackRef } from '@/hooks/useCallbackRef';
import { useMoneyHash } from '@/context/moneyHashProvider';

export function IntentForm({
  intentId,
  onIntentDetailsChange,
}: {
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
}) {
  const moneyHash = useMoneyHash();
  const containerRef = useRef<HTMLDivElement>(null);

  const onIntentDetailsChangeRef = useCallbackRef(onIntentDetailsChange);
  useEffect(() => {
    moneyHash
      .renderForm({
        selector: '#moneyHash-intent-form',
        intentId,
      })
      .then(onIntentDetailsChangeRef);
  }, [intentId, onIntentDetailsChangeRef, moneyHash]);

  return <div ref={containerRef} id="moneyHash-intent-form" className="h-96" />;
}

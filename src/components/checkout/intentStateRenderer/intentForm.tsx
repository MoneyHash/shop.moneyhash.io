import { useEffect, useRef } from 'react';
import { moneyHash } from '@/utils/moneyHash';

export function IntentForm({ intentId }: { intentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    moneyHash.renderForm({
      selector: '#moneyHash-intent-form',
      intentId,
    });
  }, [intentId]);

  return <div ref={containerRef} id="moneyHash-intent-form" className="h-96" />;
}

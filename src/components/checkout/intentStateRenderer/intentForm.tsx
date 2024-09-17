import { useEffect } from 'react';
import { moneyHash } from '@/utils/moneyHash';

export function IntentForm({ intentId }: { intentId: string }) {
  useEffect(() => {
    moneyHash.renderForm({
      selector: '#moneyHash-intent-form',
      intentId,
    });
  }, [intentId]);

  return <div id="moneyHash-intent-form" className="h-96" />;
}

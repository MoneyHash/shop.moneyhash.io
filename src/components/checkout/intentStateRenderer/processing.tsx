import { useEffect } from 'react';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import { useTranslation } from 'react-i18next';

import Loader from '@/components/loader';
import { useCallbackRef } from '@/hooks/useCallbackRef';
import { useMoneyHash } from '@/context/moneyHashProvider';
import { logJSON } from '@/utils/logJSON';

const POLL_INTERVAL = 3000;

export function Processing({
  intentId,
  onIntentDetailsChange,
}: {
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
}) {
  const { t } = useTranslation();
  const moneyHash = useMoneyHash();
  const onIntentDetailsChangeRef = useCallbackRef(onIntentDetailsChange);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const intentDetails = await moneyHash.getIntentDetails(intentId);
        if (!active) return;
        logJSON.response('getIntentDetails', intentDetails);

        if (intentDetails.state === 'PROCESSING') {
          timeoutId = setTimeout(poll, POLL_INTERVAL);
        } else {
          onIntentDetailsChangeRef(intentDetails);
        }
      } catch (error) {
        if (!active) return;
        logJSON.error('getIntentDetails', error);
        timeoutId = setTimeout(poll, POLL_INTERVAL);
      }
    };

    timeoutId = setTimeout(poll, POLL_INTERVAL);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [intentId, moneyHash, onIntentDetailsChangeRef]);

  return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader />
      <p className="text-sm text-subtle">{t('payment.processing')}</p>
    </div>
  );
}

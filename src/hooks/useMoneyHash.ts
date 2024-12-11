import MoneyHash, {
  MoneyHashHeadlessOptions,
} from '@moneyhash/js-sdk/headless';
import { useEffect, useMemo, useRef } from 'react';
import useCurrency from '../store/useCurrency';

export default function useMoneyHash({
  onComplete,
  onFail,
}: {
  onComplete?: MoneyHashHeadlessOptions<'payment'>['onComplete'];
  onFail?: MoneyHashHeadlessOptions<'payment'>['onFail'];
} = {}) {
  const currency = useCurrency(state => state.currency);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  const moneyHash = useMemo(
    () =>
      new MoneyHash({
        type: 'payment',
        onComplete: onCompleteRef.current,
        onFail: onFailRef.current,
        locale: currency === 'EGP' ? 'ar-EG' : undefined,
        styles: {
          input: {
            focus: {
              borderColor: '#1A82C3',
              boxShadow: '0 0 0 1px #1A82C378',
            },
          },
          submitButton: {
            base: {
              background: '#1A82C3',
              color: '#fff',
            },
            hover: {
              background: '#15699e',
            },
            focus: {
              background: '#15699e',
            },
          },
          loader: {
            backgroundColor: 'white',
            color: '#1A82C3',
          },
        },
        publicApiKey:
          'public.vhmdefFo.7vfWsIfeQyVWdmUNTjSBlw1KrmM4fIxX3tO7bTUF',
      }),
    [currency],
  );

  useEffect(
    () => () => {
      moneyHash.removeEventListeners();
    },
    [moneyHash],
  );
  return moneyHash;
}

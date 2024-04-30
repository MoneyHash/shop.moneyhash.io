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
              borderColor: '#D71A21',
              boxShadow: '0 0 0 1px #D71A2178',
            },
          },
          submitButton: {
            base: {
              background: '#D71A21',
              color: '#fff',
            },
            hover: {
              background: '#c7181e',
            },
            focus: {
              background: '#c7181e',
            },
          },
          loader: {
            backgroundColor: 'white',
            color: '#D71A21',
          },
        },
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

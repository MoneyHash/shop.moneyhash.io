import MoneyHash, {
  MoneyHashHeadlessOptions,
} from '@moneyhash/js-sdk/headless';
import { useEffect, useMemo, useRef } from 'react';

export default function useMoneyHash({
  onComplete,
  onFail,
}: {
  onComplete?: MoneyHashHeadlessOptions<'payment'>['onComplete'];
  onFail?: MoneyHashHeadlessOptions<'payment'>['onFail'];
} = {}) {
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
        styles: {
          input: {
            focus: {
              borderColor: '#322e81',
              boxShadow: '0 0 0 1px #322e8178',
            },
          },
          submitButton: {
            base: {
              background: '#4f46e5',
              color: '#fff',
            },
            hover: {
              background: '#322e81',
            },
            focus: {
              background: '#322e81',
            },
          },
          loader: {
            backgroundColor: 'white',
            color: 'black',
          },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      moneyHash.removeEventListeners();
    },
    [moneyHash],
  );
  return moneyHash;
}

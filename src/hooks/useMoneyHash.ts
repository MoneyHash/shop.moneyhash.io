import MoneyHash from '@moneyhash/js-sdk/headless';
import { useEffect, useMemo, useRef } from 'react';
import useCurrency from '../store/useCurrency';

export default function useMoneyHash({
  onComplete,
  onFail,
}: {
  onComplete?: any;
  onFail?: any;
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
          'public.26eMVt1V.8aHrRwG81Xrzha5SyeyhTOSzpH48VDQCPhYvhRx4',
        // 'public.b7WVmnAe.GKSX3OfQGUTqT5fz0C3lIAZH8P05nnQSfnGtRmIU',
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

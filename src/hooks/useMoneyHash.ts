import MoneyHash from '@moneyhash/js-sdk';
import { useEffect, useMemo } from 'react';

export default function useMoneyHash() {
  const moneyHash = useMemo(() => new MoneyHash({ type: 'payment' }), []);
  useEffect(
    () => () => {
      moneyHash.removeEventListeners();
    },
    [moneyHash],
  );
  return moneyHash;
}

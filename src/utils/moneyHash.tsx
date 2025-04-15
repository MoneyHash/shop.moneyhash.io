import MoneyHashHeadless from '@moneyhash/js-sdk/headless';
import { ACCOUNT_PUBLIC_API_KEY } from '@/api';
import safeLocalStorage from '@/utils/safeLocalStorage';

export const moneyHash = new MoneyHashHeadless({
  type: 'payment',
  styles: {
    loader: {
      backgroundColor: 'white',
      color: 'black',
    },
  },
  publicApiKey:
    safeLocalStorage.getItem('publicApiKey') || ACCOUNT_PUBLIC_API_KEY,
});

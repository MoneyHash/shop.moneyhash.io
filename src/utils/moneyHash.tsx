import MoneyHashHeadless from '@moneyhash/js-sdk/headless';
import { ACCOUNT_PUBLIC_API_KEY } from '@/api';
import safeLocalStorage from '@/utils/safeLocalStorage';

// onComplete: async ({ intent }) => {
//   navigate(`/checkout/order?intent_id=${intent.id}`, { replace: true });
// },
// onFail: ({ intent }) => navigate(`/checkout/order?intent_id=${intent.id}`),

export const moneyHash = new MoneyHashHeadless({
  type: 'payment',
  onComplete: ({ intent }) => {
    window.location.href = `/checkout/order?intent_id=${intent.id}`;
  },
  onFail: ({ intent }) => {
    window.location.href = `/checkout/order?intent_id=${intent.id}`;
  },
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
  publicApiKey:
    safeLocalStorage.getItem('publicApiKey') || ACCOUNT_PUBLIC_API_KEY,
});

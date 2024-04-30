import { create } from 'zustand';

export type Currency = 'AED' | 'USD' | 'EGP';

type State = {
  currency: Currency;
};

type Action = {
  setCurrency: (currency: State['currency']) => void;
};

const useCurrency = create<State & Action>(set => ({
  currency: 'AED',
  setCurrency: currency => set({ currency }),
}));

export default useCurrency;

import { create } from 'zustand';
import type { Currency } from '../utils/productSections';

type State = {
  currency: Currency;
};

type Action = {
  setCurrency: (currency: State['currency']) => void;
};

const useCurrency = create<State & Action>(set => ({
  currency: 'USD',
  setCurrency: currency => set({ currency }),
}));

export default useCurrency;

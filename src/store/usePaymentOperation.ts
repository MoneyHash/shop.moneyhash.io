import { create } from 'zustand';

type Operation = 'purchase' | 'authorize';

type State = {
  operation: Operation;
};

type Action = {
  setOperation: (operation: Operation) => void;
};

const usePaymentOperation = create<State & Action>(set => ({
  operation: 'purchase',
  setOperation: operation => set({ operation }),
}));

export default usePaymentOperation;

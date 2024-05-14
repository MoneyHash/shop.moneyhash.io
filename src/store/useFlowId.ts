import { create } from 'zustand';

type State = {
  flowId: string;
};

type Action = {
  setFlowId: (currency: State['flowId']) => void;
};

const useFlowId = create<State & Action>(set => ({
  flowId: '',
  setFlowId: flowId => set({ flowId }),
}));

export default useFlowId;

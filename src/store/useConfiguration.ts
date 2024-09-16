import { create } from 'zustand';

type State = {
  layout: 'accordion' | 'tabs';
  theme: 'light' | 'dark';
};

type Action = {
  setConfiguration: (state: Partial<State>) => void;
};

const useConfiguration = create<State & Action>(set => ({
  layout: 'accordion',
  theme: 'light',
  setConfiguration: state => set(state),
}));

export default useConfiguration;

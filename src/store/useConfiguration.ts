import { create } from 'zustand';

type State = {
  layout: 'accordion' | 'tabs';
  theme: 'light' | 'dark';
  cardForm: 'compact' | 'expanded';
  fontFamily: string;
};

type Action = {
  setConfiguration: (state: Partial<State>) => void;
};

const useConfiguration = create<State & Action>(set => ({
  layout: 'accordion',
  theme: 'light',
  cardForm: 'compact',
  fontFamily: '',
  setConfiguration: state => set(state),
}));

export default useConfiguration;
import { create } from 'zustand';
import type { UrlRenderStrategy } from '@moneyhash/js-sdk/headless';

type State = {
  layout: 'accordion' | 'tabs';
  theme: 'light' | 'dark';
  cardForm: 'compact' | 'expanded';
  fontFamily: 'Default' | (string & {});
  renderStrategy: 'auto' | UrlRenderStrategy;
};

type Action = {
  setConfiguration: (state: Partial<State>) => void;
};

const useConfiguration = create<State & Action>(set => ({
  layout: 'accordion',
  theme: 'light',
  cardForm: 'compact',
  fontFamily: 'Default',
  renderStrategy: 'auto',
  setConfiguration: state => set(state),
}));

export default useConfiguration;

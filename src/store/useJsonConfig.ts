import { create } from 'zustand';
import safeLocalStorage from '../utils/safeLocalStorage';

export const DEFAULT_JSON_CONFIG = '{}';

type State = {
  jsonConfig: string;
};

type Action = {
  setJsonConfig: (jsonConfig: State['jsonConfig']) => void;
};

const useJsonConfig = create<State & Action>(set => ({
  jsonConfig: safeLocalStorage.getItem('jsonConfig') || DEFAULT_JSON_CONFIG,
  setJsonConfig: jsonConfig => {
    safeLocalStorage.setItem('jsonConfig', jsonConfig);
    set({ jsonConfig });
  },
}));

export function getJsonConfig(): Record<string, unknown> {
  try {
    const parsed = JSON.parse(useJsonConfig.getState().jsonConfig);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export default useJsonConfig;

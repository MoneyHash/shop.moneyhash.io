import { create } from 'zustand';
import safeLocalStorage from '../utils/safeLocalStorage';

type State = {
  jsonConfig: string;
};

type Action = {
  setJsonConfig: (jsonConfig: State['jsonConfig']) => void;
};

const getSavedConfig = () => {
  try {
    return safeLocalStorage.getItem('jsonConfig') || '';
  } catch {
    return '';
  }
};

const useJsonConfig = create<State & Action>(set => {
  const savedConfig = getSavedConfig();

  return {
    jsonConfig: savedConfig || '{}',
    setJsonConfig: jsonConfig => set({ jsonConfig }),
  };
});

export default useJsonConfig;

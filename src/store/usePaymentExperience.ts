import { create } from 'zustand';

type Experience = 'in-app' | 'redirect';

type State = {
  experience: Experience;
};

type Action = {
  setExperience: (experience: Experience) => void;
};

const usePaymentExperience = create<State & Action>(set => ({
  experience: 'in-app',
  setExperience: experience => set({ experience }),
}));

export default usePaymentExperience;

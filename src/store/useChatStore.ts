import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CounterState {
  resumeContent: string;
  isFirstRequest: boolean | null;
}

export interface CounterActions {
  setResumeContent: (content: string) => void;
  setIsFirstRequest: (isFirstRequest: boolean | null) => void;
}

export type CounterStore = CounterState & CounterActions;

// persist the store in session storage

export const useChatStore = create<CounterStore>()(
  persist(
    (set) => ({
      resumeContent: '',
      isFirstRequest: null,
      setResumeContent: (content: string) => set({ resumeContent: content }),
      setIsFirstRequest: (isFirstRequest: boolean | null) =>
        set({ isFirstRequest }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

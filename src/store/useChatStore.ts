import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CounterState {
  resumeContent: string;
  isFirstRequest: boolean;
}

export interface CounterActions {
  setResumeContent: (content: string) => void;
  setIsFirstRequest: (isFirstRequest: boolean) => void;
}

export type CounterStore = CounterState & CounterActions;

// persist the store in session storage

export const useChatStore = create<CounterStore>()(
  persist(
    (set) => ({
      resumeContent: '',
      isFirstRequest: true,
      setResumeContent: (content: string) => set({ resumeContent: content }),
      setIsFirstRequest: (isFirstRequest: boolean) => set({ isFirstRequest }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

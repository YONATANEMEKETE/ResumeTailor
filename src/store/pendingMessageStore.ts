import { create } from 'zustand';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';

type PendingMessage = {
  message: PromptInputMessage;
  modelId: string;
  createdAt: number;
};

interface PendingMessageStore {
  pendingByConversationId: Record<string, PendingMessage>;
  setPendingMessage: (
    conversationId: string,
    message: PromptInputMessage,
    modelId: string
  ) => void;
  consumePendingMessage: (conversationId: string) => PendingMessage | null;
  clearPendingMessage: (conversationId: string) => void;
}

export const usePendingMessageStore = create<PendingMessageStore>(
  (set, get) => ({
  pendingByConversationId: {},

  setPendingMessage: (conversationId, message, modelId) => {
    set((state) => ({
      pendingByConversationId: {
        ...state.pendingByConversationId,
        [conversationId]: { message, modelId, createdAt: Date.now() },
      },
    }));
  },

  consumePendingMessage: (conversationId) => {
    const pending = get().pendingByConversationId[conversationId] || null;
    if (!pending) return null;
    set((state) => {
      const { [conversationId]: _, ...rest } = state.pendingByConversationId;
      return { pendingByConversationId: rest };
    });
    return pending;
  },

  clearPendingMessage: (conversationId) => {
    set((state) => {
      const { [conversationId]: _, ...rest } = state.pendingByConversationId;
      return { pendingByConversationId: rest };
    });
  },
  })
);

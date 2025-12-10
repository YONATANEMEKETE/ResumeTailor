import { create } from 'zustand';

// Types
export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    messages: number;
  };
}

interface ConversationStore {
  // State
  currentConversationId: string | null;
  conversations: Conversation[];
  isLoading: boolean;

  // Actions
  setCurrentConversation: (id: string | null) => void;
  loadConversations: () => Promise<void>;
  createConversation: (title: string) => Promise<Conversation | null>;
  deleteConversation: (id: string) => Promise<void>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // Initial State
  currentConversationId: null,
  conversations: [],
  isLoading: false,

  // Set the current active conversation
  setCurrentConversation: (id) => {
    set({ currentConversationId: id });
  },

  // Load all conversations from API
  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/conversations?limit=20');
      if (!response.ok) throw new Error('Failed to fetch conversations');

      const data = await response.json();
      set({
        conversations: data.conversations,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
      set({ isLoading: false });
    }
  },

  // Create new conversation (optimistic update)
  createConversation: async (title) => {
    // Optimistic: Create temporary conversation
    const tempId = `temp-${Date.now()}`;
    const tempConversation: Conversation = {
      id: tempId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { messages: 0 },
    };

    // Add to state immediately
    set((state) => ({
      conversations: [tempConversation, ...state.conversations],
      currentConversationId: tempId,
    }));

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to create conversation');

      const data = await response.json();
      const realConversation = data.conversation;

      // Replace temp conversation with real one
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === tempId ? realConversation : conv
        ),
        currentConversationId: realConversation.id,
      }));

      return realConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);

      // Rollback: Remove temp conversation
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== tempId),
        currentConversationId: null,
      }));

      return null;
    }
  },

  // Delete conversation (optimistic update)
  deleteConversation: async (id) => {
    const { conversations, currentConversationId } = get();

    // Optimistic: Remove from state immediately
    const previousConversations = conversations;
    set({
      conversations: conversations.filter((conv) => conv.id !== id),
      currentConversationId:
        currentConversationId === id ? null : currentConversationId,
    });

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete conversation');
    } catch (error) {
      console.error('Error deleting conversation:', error);

      // Rollback: Restore conversations
      set({
        conversations: previousConversations,
        currentConversationId,
      });
    }
  },

  // Update conversation title (optimistic update)
  updateConversationTitle: async (id, title) => {
    const { conversations } = get();

    // Optimistic: Update in state immediately
    const previousConversations = conversations;
    set({
      conversations: conversations.map((conv) =>
        conv.id === id ? { ...conv, title } : conv
      ),
    });

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to update conversation');
    } catch (error) {
      console.error('Error updating conversation title:', error);

      // Rollback: Restore previous state
      set({ conversations: previousConversations });
    }
  },
}));

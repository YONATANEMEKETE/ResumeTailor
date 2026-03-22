'use client';

import { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import InitialChatView from '@/components/chat/InitialChatView';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';
import { useConversationStore } from '@/store/conversationStore';
import { usePendingMessageStore } from '@/store/pendingMessageStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ChatStatus } from 'ai';

const ChatNewPage = () => {
  const router = useRouter();
  const { createConversation, setCurrentConversation } = useConversationStore();
  const { setPendingMessage } = usePendingMessageStore();

  useEffect(() => {
    setCurrentConversation(null);
  }, [setCurrentConversation]);

  const handleSendMessage = async (
    message: PromptInputMessage,
    modelId: string
  ) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) {
      return;
    }

    const messageText = message.text || 'Sent with attachments';
    const title =
      messageText.slice(0, 50) + (messageText.length > 50 ? '...' : '');

    const newConversation = await createConversation(title);
    if (!newConversation) {
      console.error('Failed to create conversation');
      return;
    }

    setPendingMessage(newConversation.id, message, modelId);
    router.push(`/chat/${newConversation.id}`);
  };

  const readyStatus: ChatStatus = 'ready';

  return (
    <main className="min-h-screen w-full bg-secondary/50 relative">
      <div className="fixed top-4 left-4 z-3 md:hidden">
        <SidebarTrigger className="bg-background border border-border shadow-sm cursor-pointer" />
      </div>

      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatedThemeToggler className="fixed top-4 right-4 z-200" />
        <StripedPattern className="mask-[radial-gradient(300px_circle_at_center,white,transparent)] opacity-50" />
        <InitialChatView
          onSendMessage={handleSendMessage}
          status={readyStatus}
          submitKey="mod+enter"
        />
      </div>
    </main>
  );
};

export default ChatNewPage;

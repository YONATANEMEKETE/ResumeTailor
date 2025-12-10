'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar';
import { Skeleton } from '../ui/skeleton';
import { MessageSquare } from 'lucide-react';
import ConversationCard from './ConversationCard';
import { useConversationStore } from '@/store/conversationStore';

const RecentConversations = () => {
  const router = useRouter();
  const {
    conversations,
    isLoading,
    currentConversationId,
    loadConversations,
    setCurrentConversation,
    deleteConversation,
  } = useConversationStore();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleConversationClick = (id: string) => {
    setCurrentConversation(id);
    router.push(`/chat?id=${id}`);
  };

  const handleDelete = (id: string) => {
    deleteConversation(id);
  };

  const handleRename = (id: string) => {
    // TODO: Implement rename dialog
    console.log('Rename conversation:', id);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <div className="space-y-1 px-2">
        {/* Loading State */}
        {isLoading && (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </>
        )}

        {/* Empty State */}
        {!isLoading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No chats yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Start a new chat to get started
            </p>
          </div>
        )}

        {/* Conversations List */}
        {!isLoading &&
          conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
              updatedAt={new Date(conversation.updatedAt)}
              isActive={currentConversationId === conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              onDelete={() => handleDelete(conversation.id)}
              onRename={() => handleRename(conversation.id)}
            />
          ))}
      </div>
    </SidebarGroup>
  );
};

export default RecentConversations;

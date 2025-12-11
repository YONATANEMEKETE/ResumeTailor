'use client';

import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import { UserAvatar } from './UserAvatar';
import { SidebarSearch } from './SidebarSearch';
import { Separator } from '../ui/separator';
import RecentChats from '../chat/RecentConversations';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useConversationStore } from '@/store/conversationStore';

export function AppSidebar() {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { setCurrentConversation } = useConversationStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="bg-secondary border-r border-border"
    >
      <SidebarHeader
        className={cn(
          'flex md:pt-3.5 bg-secondary',
          isCollapsed
            ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start'
            : 'flex-row items-center justify-between'
        )}
      >
        <a href="#" className="flex items-center gap-2">
          {/* <Logo className="h-8 w-8" /> */}
          <div className="relative size-8">
            <Image src="/logo.png" alt="logo" fill />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-secondary-foreground">
              Resume Tailor
            </span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          className={cn(
            'flex items-center gap-2',
            isCollapsed ? 'flex-row md:flex-col-reverse' : 'flex-row'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger className="cursor-pointer" />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="bg-secondary pt-6">
        {!isCollapsed && (
          <SidebarSearch
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        )}
        <div
          className={cn(
            'px-2 pb-2',
            isCollapsed && 'px-0 flex justify-center pt-2'
          )}
        >
          <Button
            onClick={() => {
              setCurrentConversation(null);
              router.push('/chat');
            }}
            className={cn(
              'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer',
              isCollapsed ? 'h-8 w-8 p-0 rounded-md' : 'w-full justify-start'
            )}
          >
            <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
            {!isCollapsed && <span>New Chat</span>}
          </Button>
        </div>
        <Separator />
        <RecentChats searchQuery={searchQuery} />
      </SidebarContent>
      <SidebarFooter className="px-2 bg-secondary">
        <UserAvatar />
      </SidebarFooter>
    </Sidebar>
  );
}

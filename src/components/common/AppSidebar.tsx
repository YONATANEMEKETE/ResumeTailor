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
import { UserAvatar } from './UserAvatar';
import { SidebarSearch } from './SidebarSearch';
import RecentChats from '../chat/RecentConversations';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserFeedback } from './UserFeedback';
import { AppLogo } from '@/components/common/AppLogo';

export function AppSidebar() {
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className={cn(
        'border-sidebar-border/70 bg-sidebar/95 supports-[backdrop-filter]:bg-sidebar/80 supports-[backdrop-filter]:backdrop-blur-xl',
        'shadow-[inset_-1px_0_0_hsl(var(--sidebar-border))]'
      )}
    >
      <SidebarHeader
        className={cn(
          'flex md:pt-3.5 bg-transparent',
          isCollapsed
            ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-center md:justify-center'
            : 'flex-row items-center justify-between'
        )}
      >
        <a
          href="#"
          className={cn(
            'flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors',
            'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            isCollapsed && 'md:w-full md:justify-center md:px-0'
          )}
        >
          {/* <Logo className="h-8 w-8" /> */}
          <AppLogo size={30} className="shrink-0" />
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                ResumeTailor
              </span>
              <span className="text-[11px] text-sidebar-foreground/60">
                Chats and projects
              </span>
            </div>
          )}
        </a>

        <motion.div
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          className={cn(
            'flex items-center gap-2',
            isCollapsed
              ? 'flex-row md:flex-col-reverse md:w-full md:justify-center'
              : 'flex-row'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </motion.div>
      </SidebarHeader>
      <SidebarSeparator className={cn(isCollapsed && 'mx-auto w-8')} />
      <SidebarContent
        className={cn(
          'bg-transparent pt-4',
          isCollapsed && 'items-center gap-3 pt-3'
        )}
      >
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
              router.push('/chat/new');
            }}
            className={cn(
              'cursor-pointer shadow-sm',
              'bg-gradient-to-b from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground',
              'ring-1 ring-sidebar-border/40 hover:ring-sidebar-ring/60',
              'hover:brightness-[1.02] active:brightness-[0.98]',
              isCollapsed
                ? 'h-9 w-9 p-0 rounded-xl'
                : 'w-full justify-start rounded-xl'
            )}
          >
            <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
            {!isCollapsed && <span>New Chat</span>}
          </Button>
        </div>
        <SidebarSeparator className={cn(isCollapsed && 'mx-auto w-8')} />
        <RecentChats searchQuery={searchQuery} />
      </SidebarContent>
      <SidebarSeparator className={cn(isCollapsed && 'mx-auto w-8')} />
      <SidebarFooter
        className={cn('bg-transparent', isCollapsed ? 'px-0 items-center' : 'px-2')}
      >
        {!isCollapsed && <UserFeedback />}
        <UserAvatar />
      </SidebarFooter>
    </Sidebar>
  );
}

'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import { UserAvatar } from './UserAvatar';

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

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
      <SidebarContent className="bg-secondary"></SidebarContent>
      <SidebarFooter className="px-2 bg-secondary">
        <UserAvatar />
      </SidebarFooter>
    </Sidebar>
  );
}

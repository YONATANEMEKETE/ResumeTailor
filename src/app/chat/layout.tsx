import { AppSidebar } from '@/components/common/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

const chatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <AppSidebar />

        {children}
      </div>
    </SidebarProvider>
  );
};

export default chatLayout;

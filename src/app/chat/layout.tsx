import { AppSidebar } from '@/components/common/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { OnBoarding } from '@/components/common/OnBoarding';

const chatLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let showOnboarding = false;
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (user && !user.completedOnboarding) {
      showOnboarding = true;
    }
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <AppSidebar />
        {showOnboarding && <OnBoarding />}
        {children}
      </div>
    </SidebarProvider>
  );
};

export default chatLayout;

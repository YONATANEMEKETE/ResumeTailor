'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <AppLogo size={30} />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Resume Tailor
            </span>
          </Link>

          {/* CTA Button */}
          <Link href="/chat/new">
            <Button className="rounded-md px-5 font-medium transition-all hover:ring-2 hover:ring-primary/20 group cursor-pointer">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

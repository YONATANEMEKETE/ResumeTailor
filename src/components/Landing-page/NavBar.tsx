'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="w-full z-50 fixed top-0 inset-x-0 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={'/'}
              className="cursor-pointer flex items-center gap-x-1.5 sm:gap-x-2"
            >
              <div className="relative size-8 sm:size-10 md:size-11">
                <Image
                  src="/logo.png"
                  alt="Resume Tailor Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl text-foreground font-bold font-lobster">
                Resume Tailor
              </span>
            </Link>
          </div>

          {/* CTA Button */}
          <Link href="/auth/signin">
            <Button
              size="sm"
              className="from-primary via-primary/60 to-primary bg-transparent bg-linear-to-r bg-size-[200%_auto] hover:bg-transparent hover:bg-position-[99%_center] cursor-pointer text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 h-8 sm:h-9 md:h-10"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image
                src="/logo1.png"
                alt="Resume Tailor Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              Resume Tailor
            </span>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
          >
            Try for Free
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

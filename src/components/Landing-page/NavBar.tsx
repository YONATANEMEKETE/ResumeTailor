'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { TextureButton } from '../ui/texture-button';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="w-full z-50 fixed top-0 inset-x-0">
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
          <Link href="/chat">
            <Button className="from-primary via-primary/60 to-primary bg-transparent bg-linear-to-r bg-size-[200%_auto] hover:bg-transparent hover:bg-position-[99%_center] cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

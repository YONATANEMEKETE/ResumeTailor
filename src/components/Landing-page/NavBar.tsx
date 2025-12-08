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
            <Link href={'/'} className="relative w-48 h-16 cursor-pointer">
              <Image
                src="/logo-with-text.png"
                alt="Resume Tailor Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
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

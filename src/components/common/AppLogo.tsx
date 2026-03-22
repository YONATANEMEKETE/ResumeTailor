import React from 'react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo = ({ className, size = 36 }: AppLogoProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-all hover:scale-105 hover:shadow-md',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3/5 w-3/5"
      >
        {/* Document Outline */}
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />

        {/* Folded Corner */}
        <polyline points="14 2 14 8 20 8" />

        {/* "Tailored" Lines - representing organized/optimized content */}
        <path d="M8 13h8" />
        <path d="M8 17h6" />
        <path d="M8 9h2" />
      </svg>
    </div>
  );
};

export default AppLogo;

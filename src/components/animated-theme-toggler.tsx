'use client';

import { useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

type AnimatedThemeTogglerProps = {
  className?: string;
};

export const AnimatedThemeToggler = ({
  className,
}: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { left, top, width, height } =
      buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const maxDistance = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${centerX}px ${centerY}px)`,
          `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
        ],
      },
      {
        duration: 700,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }, [theme, setTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label="Switch theme"
      className={cn(
        'flex items-center justify-center rounded-xl outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer',
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-white"
          >
            <Sun className="size-5" />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-black"
          >
            <Moon className="size-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

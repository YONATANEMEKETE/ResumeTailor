'use client';

/**
 * @author: @dorian_baffier
 * @description: Shape Hero
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from 'motion/react';
import { Pacifico } from 'next/font/google';
import { cn } from '@/lib/utils';

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
  borderRadius = 16,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  borderRadius?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          style={{ borderRadius }}
          className={cn(
            'absolute inset-0',
            'bg-linear-to-r to-transparent',
            gradient,
            'backdrop-blur-[1px]',
            'ring-1 ring-white/3 dark:ring-white/2',
            'shadow-[0_2px_16px_-2px_rgba(255,255,255,0.04)]',
            'after:absolute after:inset-0',
            'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)]',
            'after:rounded-[inherit]'
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ShapeHero() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/2 via-transparent to-rose-500/2 dark:from-indigo-500/5 dark:via-transparent dark:to-rose-500/5 blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        {/* Tall rectangle - top left */}
        <ElegantShape
          delay={0.3}
          width={300}
          height={500}
          rotate={-8}
          borderRadius={24}
          gradient="from-indigo-500/[0.25] dark:from-indigo-500/[0.35]"
          className="left-[-15%] top-[-10%]"
        />

        {/* Wide rectangle - bottom right */}
        <ElegantShape
          delay={0.5}
          width={600}
          height={200}
          rotate={15}
          borderRadius={20}
          gradient="from-rose-500/[0.25] dark:from-rose-500/[0.35]"
          className="right-[-20%] bottom-[-5%]"
        />

        {/* Square - middle left */}
        <ElegantShape
          delay={0.4}
          width={300}
          height={300}
          rotate={24}
          borderRadius={32}
          gradient="from-violet-500/[0.25] dark:from-violet-500/[0.35]"
          className="left-[-5%] top-[40%]"
        />

        {/* Small rectangle - top right */}
        <ElegantShape
          delay={0.6}
          width={250}
          height={100}
          rotate={-20}
          borderRadius={12}
          gradient="from-amber-500/[0.25] dark:from-amber-500/[0.35]"
          className="right-[10%] top-[5%]"
        />

        {/* New shapes */}
        {/* Medium rectangle - center right */}
        <ElegantShape
          delay={0.7}
          width={400}
          height={150}
          rotate={35}
          borderRadius={16}
          gradient="from-emerald-500/[0.25] dark:from-emerald-500/[0.35]"
          className="right-[-10%] top-[45%]"
        />

        {/* Small square - bottom left */}
        <ElegantShape
          delay={0.2}
          width={200}
          height={200}
          rotate={-25}
          borderRadius={28}
          gradient="from-blue-500/[0.25] dark:from-blue-500/[0.35]"
          className="left-[20%] bottom-[10%]"
        />

        {/* Tiny rectangle - top center */}
        <ElegantShape
          delay={0.8}
          width={150}
          height={80}
          rotate={45}
          borderRadius={10}
          gradient="from-purple-500/[0.25] dark:from-purple-500/[0.35]"
          className="left-[40%] top-[15%]"
        />

        {/* Wide rectangle - middle */}
        <ElegantShape
          delay={0.9}
          width={450}
          height={120}
          rotate={-12}
          borderRadius={18}
          gradient="from-teal-500/[0.25] dark:from-teal-500/[0.35]"
          className="left-[25%] top-[60%]"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
    </div>
  );
}

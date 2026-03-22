'use client';

import React, { useRef } from 'react';
import ShapeHero from '../kokonutui/shape-hero';
import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { AnimatedShinyText } from '../ui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, // Custom easing for smooth animation
      },
    },
  };

  const mockupRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mockupRef,
    offset: ['start end', 'center center'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [85, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1.2]);

  return (
    <section className="relative min-h-screen w-full bg-background overflow-hidden">
      <div className="absolute inset-0">
        <ShapeHero />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto flex max-w-4xl flex-col items-center text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className={cn(
                'group rounded-md border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 mb-10',
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-2 py-o.5 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 rounded-md">
                <span>✨ ATS Optimized Resume</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 md:mb-8"
            >
              Your AI Partner for Landing the{' '}
              <span className="relative inline-flex items-center gap-2">
                <span className="font-extrabold uppercase tracking-wide text-primary">JOB</span>
                <span>You Want</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2, duration: 0.5, ease: 'easeOut' }}
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent origin-left"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-4xl mb-10 md:mb-12 leading-relaxed"
            >
              Upload your resume, share the job description, and let the AI
              guide you with friendly, detailed insights plus a fully rewritten
              resume built for your next opportunity.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Link href="/chat/new">
                <Button
                  size={'lg'}
                  className="rounded-md px-5 font-medium text-white transition-all hover:ring-2 hover:ring-primary/20 group cursor-pointer w-56 h-12 relative overflow-hidden"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Try for Free
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                    <ArrowRightIcon className="size-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
            {/* Mockup - Modern SaaS Style */}
            <motion.div
              variants={itemVariants}
              className="relative mt-16 md:mt-20 w-full max-w-5xl"
              ref={mockupRef}
            >
              {/* Gradient Glow Background */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-primary via-blue-500 to-purple-500 rounded-full" />
              </div>

              {/* Floating Animation Container */}
              <motion.div
                style={{
                  rotateX,
                  rotateZ,
                  scale,
                  perspective: 1200,
                }}
                className="relative"
              >
                {/* Gradient Border Container */}
                <div className="relative rounded-2xl">
                  {/* Inner Container with Glassmorphism */}
                  <div className="relative rounded-2xl overflow-hidden">
                    {/* Image Container */}
                    <div className="relative aspect-video w-full">
                      <Image
                        src={'/landing-page/main-mockup.png'}
                        alt="Resume Tailor Dashboard Preview - AI-powered resume optimization"
                        fill
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

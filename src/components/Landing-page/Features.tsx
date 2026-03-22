'use client';

import {
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const features: Feature[] = [
  {
    title: 'Lightning Fast',
    description:
      'Get your tailored resume in seconds. Upload, analyze, and download—all in under a minute.',
    icon: Zap,
    className: 'md:col-span-2',
  },
  {
    title: 'AI-Powered Analysis',
    description:
      'Advanced AI analyzes job descriptions and optimizes your resume to match exactly what recruiters are looking for.',
    icon: Cpu,
    className: 'md:col-span-1',
  },
  {
    title: 'ATS-Optimized',
    description:
      'Every resume passes through Applicant Tracking Systems with proper formatting and keyword optimization.',
    icon: Fingerprint,
    className: 'md:col-span-1',
  },
  {
    title: 'Smart Matching',
    description:
      'Get detailed match scores and insights showing how well your resume aligns with the job requirements.',
    icon: Sparkles,
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Complete Control',
    description:
      "You decide what stays and what goes. The AI assists, but you're always in the driver's seat of your career.",
    icon: Settings2,
    className: 'md:col-span-1',
  },
  {
    title: 'Fully Customizable',
    description:
      'Review and edit AI suggestions to ensure your resume reflects your unique voice and experiences.',
    icon: Pencil,
    className: 'md:col-span-2',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Built for Job Seekers Who Want Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Resume Tailor combines advanced AI technology with proven job search
            strategies to help you create resumes that get noticed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {features.map((feature, index) => (
            <BentoCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ feature }: { feature: Feature }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        'group relative border border-border/40 bg-gradient-to-br from-background/80 to-background/40 overflow-hidden rounded-2xl p-8 backdrop-blur-sm transition-all duration-500 ease-out hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5',
        feature.className,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Premium spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.25),
              transparent 50%
            )
          `,
        }}
      />

      {/* Inner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/15 via-transparent to-primary/10" />

      {/* Border glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ring-1 ring-inset ring-primary/20 shadow-[inset_0_0_30px_rgba(var(--primary-rgb),0.1)]" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-inset ring-primary/30 transition-all duration-300 group-hover:ring-primary/60 group-hover:bg-primary/20">
          <feature.icon
            className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-xl font-semibold leading-7 text-foreground mb-3 transition-colors duration-300 group-hover:text-primary">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed flex-grow text-[15px]">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

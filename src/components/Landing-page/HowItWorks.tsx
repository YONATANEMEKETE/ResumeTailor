'use client';

import React from 'react';
import { Upload, FileSearch, Sparkles, Edit3, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Upload Your Resume',
      description:
        'Start by uploading your current resume. We support PDF and Word formats. Secure and private.',
      icon: Upload,
    },
    {
      title: 'Analyze the Job',
      description:
        'Paste the job description you are targeting. Our AI identifies key skills, keywords, and requirements.',
      icon: FileSearch,
    },
    {
      title: 'Instant Tailoring',
      description:
        'Watch as our AI rewrites your resume, optimizing every bullet point to match the job description perfectly.',
      icon: Sparkles,
    },
    {
      title: 'Refine & Edit',
      description:
        'Use our intuitive editor to tweak the AI suggestions. You have full control over the final output.',
      icon: Edit3,
    },
    {
      title: 'Download & Apply',
      description:
        'Export your polished, ATS-ready resume as a PDF and apply with confidence.',
      icon: Download,
    },
  ];

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-0 w-full h-[500px] -translate-y-1/2 bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
          >
            Simple 5-Step Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Go from generic to hired in minutes. Our streamlined workflow makes
            tailoring your resume effortless.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'relative flex items-center md:justify-between',
                    isEven ? 'flex-row' : 'flex-row md:flex-row-reverse'
                  )}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[27px] md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary ring-4 ring-primary/20 -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />

                  {/* Content Card */}
                  <div className="ml-16 md:ml-0 w-full md:w-[calc(50%-40px)]">
                    <div className="group relative p-6 rounded-2xl border border-border/40 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-out hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                      {/* Subtle inner glow on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                      
                      {/* Border glow on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ring-1 ring-inset ring-primary/10" />
                      
                      <div className="relative z-10 flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-inset ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-md group-hover:shadow-primary/10">
                          <step.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <span className="text-4xl font-bold text-muted-foreground/10 select-none absolute right-6 top-6 transition-colors duration-300 group-hover:text-primary/20">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="relative z-10 text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-primary">
                        {step.title}
                      </h3>
                      <p className="relative z-10 text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for desktop layout balance */}
                  <div className="hidden md:block w-[calc(50%-40px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

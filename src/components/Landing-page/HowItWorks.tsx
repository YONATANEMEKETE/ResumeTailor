'use client';

import React from 'react';
import { Upload, FileSearch, Sparkles, Edit3, Download } from 'lucide-react';
import { motion } from 'motion/react';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Upload',
      description: 'Add your resume and paste the job description.',
      icon: Upload,
    },
    {
      number: '2',
      title: 'Analyze',
      description: 'AI reviews both and highlights what needs improvement.',
      icon: FileSearch,
    },
    {
      number: '3',
      title: 'Tailor',
      description: 'Get a rewritten, job-ready version of your resume.',
      icon: Sparkles,
    },
    {
      number: '4',
      title: 'Edit',
      description: 'Make quick adjustments in the built-in editor.',
      icon: Edit3,
    },
    {
      number: '5',
      title: 'Export',
      description: 'Download as PDF or copy to Google Docs (coming soon).',
      icon: Download,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 md:mb-20 max-w-3xl text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            From upload to export in just 5 simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-border/50" />

          <div className="grid gap-8 md:gap-12 lg:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Number Badge */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                      <span className="text-2xl font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                    {/* Connecting dot for mobile */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden absolute left-1/2 -bottom-8 w-0.5 h-8 bg-border/50 -translate-x-1/2" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-background border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

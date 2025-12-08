'use client';

import {
  Sparkles,
  Target,
  Zap,
  Shield,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

interface Feature {
  heading: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature43Props {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const Feature43 = ({
  title = 'Why Choose Resume Tailor?',
  subtitle = 'Everything you need to land your dream job, powered by AI',
  features = [
    {
      heading: 'AI-Powered Optimization',
      description:
        'Our advanced AI analyzes your resume and the job description to create a perfectly tailored resume that highlights your most relevant skills and experiences.',
      icon: <Sparkles className="size-6" />,
    },
    {
      heading: 'ATS-Friendly Format',
      description:
        'Every resume is optimized to pass Applicant Tracking Systems (ATS), ensuring your application reaches human recruiters without getting filtered out.',
      icon: <Shield className="size-6" />,
    },
    {
      heading: 'Job Match Analysis',
      description:
        'Get detailed insights on how well your resume matches the job requirements, with specific recommendations to improve your chances of getting an interview.',
      icon: <Target className="size-6" />,
    },
    {
      heading: 'Instant Results',
      description:
        'Upload your resume and job description, and get a professionally tailored resume in seconds. No more hours spent tweaking and reformatting.',
      icon: <Zap className="size-6" />,
    },
    {
      heading: 'Higher Success Rate',
      description:
        'Increase your interview callback rate with resumes that are specifically crafted to match what recruiters are looking for in each unique position.',
      icon: <TrendingUp className="size-6" />,
    },
    {
      heading: 'Professional Quality',
      description:
        'Every resume is formatted with industry best practices, proper structure, and compelling language that showcases your qualifications effectively.',
      icon: <FileCheck className="size-6" />,
    },
  ],
}: Feature43Props) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">{subtitle}</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative flex flex-col p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold tracking-tight">
                {feature.heading}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Gradient accent on hover */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { Feature43 };

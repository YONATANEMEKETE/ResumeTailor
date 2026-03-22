'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function CallToAction() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background with primary color */}
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
        >
          Ready to Land Your Dream Job?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join thousands of job seekers who have optimized their resumes and
          fast-tracked their careers with Resume Tailor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/chat/new">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base rounded-md cursor-pointer bg-white text-black hover:bg-zinc-100 transition-all duration-300 group shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-sm text-white/60"
        >
          No credit card required. Free plan available.
        </motion.p>
      </div>
    </section>
  );
}

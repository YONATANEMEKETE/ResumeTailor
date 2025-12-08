'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

const Cta = () => {
  return (
    <section className="relative py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to Land Your Dream Job?
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10">
            Transform your resume today and start getting more interviews
            tomorrow.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/chat">
              <Button
                size="lg"
                className="from-primary via-primary/80 to-primary bg-linear-to-r bg-size-[200%_auto] hover:bg-position-[right_center] transition-all duration-300 cursor-pointer h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Optional: Trust Badge */}
          <p className="mt-6 text-sm text-muted-foreground">Free to try</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;

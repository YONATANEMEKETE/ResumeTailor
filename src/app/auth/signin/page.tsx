'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { BriefcaseBusiness } from 'lucide-react';
import ShapeHero from '@/components/kokonutui/shape-hero';
import Signin from '@/components/auth/Signin';

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    // This will be connected to your auth provider later
    console.log('Google Sign In clicked');
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Visual & Branding (Hidden on mobile) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        {/* Animated Shape Background */}
        <div className="absolute inset-0 z-0 overflow-hidden dark">
          <ShapeHero />
        </div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="relative size-10">
            <Image src="/logo.png" alt="Logo" fill objectFit="contain" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Resume Tailor
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold leading-tight mb-6"
          >
            Craft the perfect resume for every job application with AI
            precision.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-lg text-zinc-400 leading-relaxed">
              Stop guessing what recruiters want. Tailor your resume instantly
              to any job description and{' '}
              <span className="text-zinc-100 font-medium">
                increase your interview chances by 3x
              </span>
              .
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full w-fit border border-indigo-500/20">
                <BriefcaseBusiness className="w-4 h-4" />
                <span>Join others landing their dream jobs</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-zinc-500">
          © 2025 Resume Tailor.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <Signin />
      </div>
    </div>
  );
}

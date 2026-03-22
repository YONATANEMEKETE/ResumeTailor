import React from 'react';
import { Linkedin, Send, Instagram, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { AppLogo } from '@/components/common/AppLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/',
    },
  ];

  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* App Name */}
          <div className="flex flex-col items-center gap-2">
            <AppLogo size={32} className="" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">Resume Tailor</h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI-Powered Resume Optimization
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all duration-300"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Resume Tailor. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

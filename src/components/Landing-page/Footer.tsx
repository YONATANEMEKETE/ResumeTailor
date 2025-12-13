import React from 'react';
import { Linkedin, Send, Instagram, Github } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/yonatanemekete/',
    },
    {
      name: 'Telegram',
      icon: Send,
      href: 'https://t.me/yonatanemekete',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/yonatane_m/',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/YONATANEMEKETE',
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* App Name */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Resume Tailor</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI-Powered Resume Optimization
            </p>
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
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
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

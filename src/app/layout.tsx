import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lobster } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const lobster = Lobster({
  variable: '--font-lobster',
  subsets: ['latin'],
  weight: ['400'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ResumeTailor AI — Tailor Your Resume to Any Job',
    template: '%s | ResumeTailor AI',
  },

  description:
    'ResumeTailor AI helps you tailor your resume to any job description using AI. Upload your resume, analyze gaps, generate an ATS-optimized version, and apply with confidence.',

  applicationName: 'ResumeTailor AI',

  keywords: [
    'resume tailoring',
    'AI resume builder',
    'resume optimization',
    'ATS resume',
    'job application AI',
    'resume analysis',
    'career tools',
    'resume generator',
    'job search assistant',
  ],

  authors: [{ name: 'ResumeTailor AI' }],

  creator: 'ResumeTailor AI',

  publisher: 'ResumeTailor AI',

  metadataBase: new URL('https://resume-tailor-zeta.vercel.app'), // change to your domain

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'ResumeTailor AI — Tailor Your Resume to Any Job',
    description:
      'Upload your resume, paste a job description, and get a tailored, ATS-optimized resume in seconds. Built to help you land interviews faster.',
    url: 'https://resume-tailor-zeta.vercel.app',
    siteName: 'ResumeTailor AI',
    images: [
      {
        url: '/og-image.png', // 1200x630 recommended
        width: 1200,
        height: 630,
        alt: 'ResumeTailor AI — AI Resume Tailoring',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${lobster.variable} antialiased transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

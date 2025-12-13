// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/chat/',
      },
    ],
    sitemap: 'https://resume-tailor-zeta.vercel.app/sitemap.xml',
  };
}

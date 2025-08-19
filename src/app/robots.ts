// app/robots.ts
import { MetadataRoute } from 'next';
import { CONFIG } from '@/config/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/admin/',
          '/*.json$',
          '/*?*', // Disallow URLs with query parameters
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 2,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
      }
    ],
    sitemap: `${CONFIG.FRONTEND_URL}/sitemap.xml`,
    host: CONFIG.FRONTEND_URL,
  };
}
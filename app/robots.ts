import type { MetadataRoute } from 'next';

const BASE_URL = 'https://rollingwithme.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/rooms', '/register', '/login', '/terms', '/privacy', '/safety', '/refund'],
        disallow: ['/admin/', '/planner/', '/host/', '/me/', '/event/', '/onboarding/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

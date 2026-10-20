const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

// Competition pages moved from /projects/{slug} to /competitions/{slug} (TZ §4).
const competitionSlugs = [
  'almaty-techcup',
  'alem-tech-fest',
  'first-robotics',
  'alem-drone-league',
  'world-space-olympiad',
  'future-race',
  'robot-battle',
  'robocup',
  'abu-robocon'
].join('|');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a verification build run next to `next dev` without sharing .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async redirects() {
    return [
      {
        source: `/:locale(kz|ru|en)/projects/:slug(${competitionSlugs})`,
        destination: '/:locale/competitions/:slug',
        // Classic 301 (Next's `permanent: true` would answer 308).
        statusCode: 301
      },
      // The personal cabinet is USTEM Connect (TZ §1, out of scope here):
      // the old template /login and /register pages send people there.
      {
        source: '/:locale(kz|ru|en)/:page(login|register)',
        destination: 'https://connect.ustem.kz/',
        permanent: false
      },
      // STEM Hanym has its own website; our site keeps only the card (TZ §8.3).
      {
        source: '/:locale(kz|ru|en)/projects/stem-hanym',
        destination: '/:locale/projects',
        statusCode: 301
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  }
};

/**
 * `npm run build:static` (STATIC_EXPORT=1) writes plain HTML to out/ for the
 * PS.kz Plesk hosting: a .kz site must be served from Kazakhstan
 * (KazNIC put ustem.kz on serverHold while it was on Vercel), and that plan
 * has no Node.js. There deploy/htaccess does the job of middleware.ts,
 * redirects() and headers() above, and scripts/finish-export.mjs writes the
 * WebP variants that /_next/image serves on a Node server.
 */
const staticExportConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Inlined into server and client code: lib/image-variant.ts reads it.
  env: { STATIC_EXPORT: '1' }
};

module.exports = withNextIntl(
  process.env.STATIC_EXPORT === '1' ? staticExportConfig : nextConfig
);

import { withSentryConfig } from '@sentry/nextjs/config';
import packageJson from './package.json' with { type: 'json' };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default withSentryConfig(nextConfig, {
  org: 'pjpirovani-soft',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

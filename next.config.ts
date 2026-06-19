import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    // Enables React's <ViewTransition> integration and wraps route
    // navigations in the browser View Transitions API.
    viewTransition: true
  }
};

export default withNextIntl(nextConfig);

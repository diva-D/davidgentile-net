import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://davidgentile.net',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    mdx(),
    partytown({
      // Forward gtag so GA calls made via the data layer resolve inside the worker.
      config: { forward: ['dataLayer.push'] },
    }),
  ],
});

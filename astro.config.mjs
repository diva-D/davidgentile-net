import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://davidgentile.net',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});

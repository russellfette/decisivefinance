import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://decisive.finance',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'directory',
  },
});

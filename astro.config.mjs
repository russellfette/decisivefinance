import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://decisive.finance',
  integrations: [mdx(), sitemap()],

  build: {
    format: 'directory',
  },

  adapter: cloudflare()
});
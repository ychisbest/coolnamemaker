// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(

    {
      filter: (page) => {
        return !page.includes('/page');
      }
    }

  ), react()],
  site: 'https://www.coolnamemaker.com',
});
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://caloriesin.netlify.app',
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'directory',
  },
});

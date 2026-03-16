import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://toopazu.net',
  trailingSlash: 'never',
  integrations: [icon()]
});

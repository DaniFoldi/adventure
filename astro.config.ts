import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'

import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    mode: 'directory'
  }),
  vite: {
    build: {
      minify: false
    }
  },
  integrations: [ tailwind(), vue() ]
})

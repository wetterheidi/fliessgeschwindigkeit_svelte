import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/fliessgeschwindigkeit_svelte/',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Fliessgeschwindigkeit Rechner',
        short_name: 'Fliessgeschw.',
        start_url: '/fliessgeschwindigkeit_svelte/',
        scope: '/fliessgeschwindigkeit_svelte/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icons/GeoInfoSim.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/GeoInfoSim.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/fliessgeschwindigkeit_svelte/index.html'
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Fliessgeschwindigkeit Rechner',
        short_name: 'Fliessgeschwindigkeit',
        description: 'Berechnung der Fliessgeschwindigkeit',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'GeoInfoSim.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'GeoInfoSim.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/wetterheidi\.github\.io\/fliessgeschwindigkeit_svelte\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fliessgeschwindigkeit-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  base: '/fliessgeschwindigkeit_svelte/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
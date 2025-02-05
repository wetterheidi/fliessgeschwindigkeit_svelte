import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/fliessgeschwindigkeit_svelte/',
  plugins: [
    svelte(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Fliessgeschwindigkeit Rechner',
        short_name: 'Fliessgeschw.',
        description: 'Berechnung der Fliessgeschwindigkeit von Gewässern',
        start_url: '/fliessgeschwindigkeit_svelte/',
        scope: '/fliessgeschwindigkeit_svelte/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/fliessgeschwindigkeit_svelte/icons/GeoInfoSim.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/fliessgeschwindigkeit_svelte/icons/GeoInfoSim.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/wetterheidi\.github\.io\/fliessgeschwindigkeit_svelte\/.*/i,
            handler: 'StaleWhileRevalidate'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})
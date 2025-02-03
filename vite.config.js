import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: '/fliessgeschwindigkeit_svelte/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
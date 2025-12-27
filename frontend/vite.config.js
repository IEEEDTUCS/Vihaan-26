import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // Load env variables based on current mode
  const env = loadEnv(mode, process.cwd(), '')

  // Safely get API_BASE
  const API_BASE = env.VITE_API_BASE || ''

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',

        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',

        includeAssets: [
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png',
          '**/*.png',
          '**/*.jpg',
          '**/*.jpeg',
          '**/*.svg',
          '**/*.webp',
        ],

        manifest: {
          name: 'VIHAAN 9.0',
          short_name: 'VIHAAN',
          start_url: '/',
          display: 'standalone',

          background_color: '#000000',
          theme_color: '#bba75d', // matches your gold accent

          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],

          screenshots: [
            {
              src: 'ccc.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'VIHAAN 9.0 – Desktop View',
            },
            {
              src: 'ccc.png',
              sizes: '540x720',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'VIHAAN 9.0 – Mobile View',
            },
          ],
        },

        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
      }),
    ],
  }
})

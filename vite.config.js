import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.GITHUB_PAGES ? '/spartan-training-tracker/' : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Spartan Training Tracker',
        short_name: 'Spartan Tracker',
        description: '6-day hypertrophy/athletic training log with 8-week progression tracking',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#1B1916',
        theme_color: '#E08A3E',
        orientation: 'portrait',
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});

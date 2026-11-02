import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dev: the browser calls relative /api/... and Vite forwards it to the SpoonUp backend (no CORS).
// Override the target with DEV_API_TARGET if the backend runs elsewhere.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { '/api': process.env.DEV_API_TARGET || 'http://localhost:5101' } }
});

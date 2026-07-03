import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local development playground — run `npm run dev` to preview components live.
export default defineConfig({
  plugins: [react()],
  root: 'playground',
  server: {
    port: 5175,
    open: true,
  },
});

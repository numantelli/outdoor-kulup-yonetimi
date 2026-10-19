import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/outdoor-kulup-yonetimi/',
  plugins: [react()],
});

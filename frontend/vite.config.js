import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Ensure JSX loader is set
    include: /src\/.*\.[tj]sx?$/, // Apply to .js, .jsx, .ts, and .tsx files in the src directory
  },
});

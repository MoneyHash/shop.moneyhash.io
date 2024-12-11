import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pkgJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    SDK_VERSION: JSON.stringify(pkgJson.dependencies['@moneyhash/js-sdk']),
  },
});

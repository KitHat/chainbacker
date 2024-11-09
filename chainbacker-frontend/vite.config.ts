import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from "node:url";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
  base: '/deton8/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

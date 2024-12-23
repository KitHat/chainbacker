import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import commonjs from '@rollup/plugin-commonjs'  // Add this import

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills(),
    commonjs({
      requireReturnsDefault: 'auto',
      // Add explicit transformations for the contract wrappers
      include: [
        '**/compiled_contracts/wrappers/**',
      ]
    })
  ],
  base: '/deton8/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['@/compiled_contracts/wrappers/KickFactory', '@/compiled_contracts/wrappers/JettonWallet', '@/compiled_contracts/wrappers/JettonMinter', '@/compiled_contracts/wrappers/JettonConstants']
  }
})
/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AmnisExpress',
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        globals: {
          '@amnis/core': 'AmnisCore',
          '@amnis/state': 'AmnisState',
          '@amnis/process': 'AmnisProcess',
        },
      },
      external: [
        '@amnis/core',
        '@amnis/state',
        '@amnis/process',
        '@reduxjs/toolkit',
      ],
    },
  },
  test: {
    globals: true,
  },
});

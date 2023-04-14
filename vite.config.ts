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
          '@amnis/state': 'AmnisState',
          '@amnis/api': 'AmnisApi',
          '@amnis/api/process': 'AmnisApiProcess',
        },
      },
      external: [
        '@amnis/state',
        '@amnis/api',
        '@amnis/api/process',
      ],
    },
  },
  test: {
    globals: true,
  },
});

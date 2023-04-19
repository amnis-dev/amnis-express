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
          express: 'Express',
          helmet: 'Helmet',
          cors: 'Cors',
          'cookie-parser': 'CookieParser',
          '@amnis/state': 'AmnisState',
          '@amnis/api': 'AmnisApi',
          '@amnis/api/process': 'AmnisApiProcess',
        },
      },
      external: [
        'express',
        'helmet',
        'cors',
        'cookie-parser',
        '@amnis/state',
        '@amnis/api',
        '@amnis/api/process',
      ],
    },
  },
  test: {
    globals: true,
    testTimeout: 20000,
  },
});

import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/items': 'http://localhost:3000',
    },
  },
});

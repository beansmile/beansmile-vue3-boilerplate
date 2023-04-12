import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { checker } from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const defaultServerConfig = {
    host: true,
    proxy: {
      '/app_api/v1': {
        target: loadEnv(mode, process.cwd()).VITE_APP_API_HOST,
        changeOrigin: true,
      },
    },
  };

  return {
    plugins: [
      vue(),
      checker({
        vueTsc: true,
        eslint: {
          // for example, lint .ts and .tsx
          lintCommand: 'eslint "./src/**/*.{ts,vue}"',
        },
        stylelint: {
          // for example, lint .css and .vue
          lintCommand: 'stylelint ./src/**/*.{scss,vue}',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
    server: {
      port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT),
      ...defaultServerConfig,
    },
    preview: {
      ...defaultServerConfig,
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/colors.scss";
            @import "@/styles/css-variable.scss";
            @import "@/styles/mixins.scss";
          `,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

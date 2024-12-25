import path from 'node:path';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { checker } from 'vite-plugin-checker';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const {
    VITE_APP_API_HOST,
    VITE_APP_PORT,
  } = loadEnv(mode, process.cwd());

  const defaultServerConfig = {
    host: true,
    proxy: {
      '/app_api/v1': {
        target: VITE_APP_API_HOST,
        changeOrigin: true,
      },
    },
  };

  return {
    plugins: [
      vue(),
      vueDevTools(),
      checker({
        vueTsc: true,
        eslint: {
          useFlatConfig: true, // https://github.com/fi3ework/vite-plugin-checker/issues/320#issuecomment-2115446921
          // for example, lint .ts and .tsx
          lintCommand: 'eslint "./src/**/*.{ts,vue}"',
        },
        stylelint: {
          // for example, lint .css and .vue
          lintCommand: 'stylelint ./src/**/*.{scss,vue} --allow-empty-input',
        },
      }),
      Components({
        directoryAsNamespace: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
    server: {
      port: Number(VITE_APP_PORT),
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

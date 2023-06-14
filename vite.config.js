import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import autoImport from 'unplugin-auto-import/vite';
import * as hooks from './src/hooks';
import * as utils from './src/utils';

const autoDirs = {
  hooks: Object.keys(hooks),
  utils: Object.keys(utils),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    autoImport({
      imports: ['vue', 'uni-app', 'pinia', {
        vue: ['defineEmits', 'defineExpose', 'defineProps'],
      }],
      resolvers: [
        name => {
          for (const k in autoDirs) {
            if (autoDirs[k].includes(name)) {
              return { from: `@/${ k }`, name };
            }
          }
          if (name === 'http') {
            return { from: '@/http', name: 'default' };
          }
          if (name === 'store') {
            return { from: '@/store', name };
          }
        },
      ],
    }),
  ],
});

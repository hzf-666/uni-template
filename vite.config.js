import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import autoImport from 'unplugin-auto-import/vite';
import postcssRelaxedUnit from 'postcss-relaxed-unit';
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
  css: {
    postcss: {
      plugins: [
        postcssRelaxedUnit({
          rules: {
            rx: `mul(750).div(${ 750 }).unit(rpx)`,
          },
        }),
      ],
    },
  },
});

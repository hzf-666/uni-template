import path from 'path';
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import autoImport from 'unplugin-auto-import/vite';
import postcssRelaxedUnit from 'postcss-relaxed-unit';
import * as hooks from './src/hooks';
import * as utils from './src/utils';

const resolve = dir => path.resolve(__dirname, dir);

const autoDirs = {
  hooks: Object.keys(hooks),
  utils: Object.keys(utils),
};

const standardWidth = 750;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const outDir = 'h5';
  const prod = command === 'build', base = prod ? `/${ outDir }/` : '/';

  return {
    base,
    define: {
      standardWidth,
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@c': resolve('src/components'),
      },
    },
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
            if (name === 'resolvePath') {
              return { from: '@/resolvePath', name: 'default' };
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
              rx: `mul(750).div(${ standardWidth }).unit(rpx)`,
            },
          }),
        ],
      },
    },
  };
});

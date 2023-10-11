import { createSSRApp } from 'vue';
import { pinia } from './store';
import App from './App.vue';
import resolvePath from './resolvePath.js';
import * as utils from './utils';

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  app.config.globalProperties.$uni = uni;
  app.config.globalProperties.$resolvePath = resolvePath;
  [utils].forEach(item => {
    for (const k in item) {
      app.config.globalProperties[`$${ k }`] = item[k];
    }
  });
  return {
    app,
  };
}

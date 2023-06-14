import { createSSRApp } from 'vue';
import { pinia } from './store';
import App from './App.vue';
import * as utils from './utils';

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  for (const k in utils) {
    app.config.globalProperties[`$${ k }`] = utils[k];
  }
  return {
    app,
  };
}

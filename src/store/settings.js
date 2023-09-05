const { DEV: dev, MODE, VITE_API_URL, VITE_PROD_API_URL } = import.meta.env, modeDev = MODE === 'development';

export default storeName => defineStore(storeName, {
  state: () => ({
    baseURL: modeDev ? (dev ? VITE_API_URL : VITE_PROD_API_URL || VITE_API_URL) || '' : '',
  }),
  getters: {
  },
  actions: {
  },
  persist: {
    paths: [
      ...(modeDev ? ['baseURL'] : []),
    ],
  },
});

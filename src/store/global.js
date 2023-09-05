export default storeName => defineStore(storeName, {
  state: () => ({
    httpCount: 0,
    statusBarHeight: '',
    menuHeight: '',
    menuPaddingRight: '',
  }),
  getters: {
  },
  actions: {
  },
  persist: {
    paths: [],
  },
});

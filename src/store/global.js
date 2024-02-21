export default (storeName) => defineStore(storeName, {
  state: () => ({
    httpCount: 0,
    statusBarHeight: '',
    menuHeight: '',
    menuPaddingRight: '',
    maskCount: 0,
    isIOS: false,
  }),
  getters: {
  },
  actions: {
  },
  persist: {
    paths: [],
  },
});

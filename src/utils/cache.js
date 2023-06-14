export default function(sync = true) {
  return {
    get: sync ? (key) => uni.getStorageSync(key) : uni.getStorage,
    set: sync ? (key, value) => void uni.setStorageSync(key, value) : uni.setStorage,
    remove: sync ? (key) => void uni.removeStorageSync(key) : uni.removeStorage,
    clear: sync ? () => void uni.clearStorageSync() : uni.clearStorage,
  };
}

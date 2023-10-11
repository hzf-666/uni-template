export default function(path) {
  let result = path;
  // #ifdef H5
  if (result.startsWith('/static')) {
    result = result.replace('/static', window.__uniConfig.router.base + 'static');
  }
  // #endif
  return result;
}

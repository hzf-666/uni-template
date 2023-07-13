import cache from '../utils/cache.js';
import { white } from './config.js';

const { httpCount } = storeToRefs(store.useGlobal());

let locking = true;
function releaseLock() {
  locking = false;
  http.unlock().then(() => {
    locking = true;
  });
}

uni.addInterceptor('request', {
  invoke(req) {
    if (isWhite(req.apiURL, white.request)) return;

    const token = cache().get('token');
    if (token && !isWhite(req.apiURL, white.token)) { // 拦截并添加 token 认证
      req.header.Authorization = token;
    }

    if (!isWhite(req.apiURL, white.httpCount)) {
      req.httpCountTimer = setTimeout(() => {
        clearTimeout(req.httpCountTimer);
        req.httpCountTimer = null;
        setHttpCount();
      }, 100);
    }
  },
  success(res, config) {
    if (isWhite(config.apiURL, white.response)) return;

    if (locking && [401].includes(res.data.code)) {
      // http.lock(res, config.args, async() => { // 添加 http 锁，实现静默登录
      //   await new Promise((resovle) => {
      //     setTimeout(() => {
      //       resovle({
      //         code: 200,
      //         message: '',
      //         data: {
      //           token: '',
      //         },
      //       });
      //     }, 100);
      //   }).then(res => {
      //     if (res.code == 200) {
      //       cache().set('token', res.data.token);
      //     }
      //   });
      //   releaseLock();
      // });
    }
  },
  complete(res, config) {
    const { apiURL, httpCountTimer } = config;
    if (!isWhite(apiURL, white.httpCount)) {
      if (httpCountTimer) {
        clearTimeout(httpCountTimer);
      } else {
        setHttpCount(true);
      }
    }
  },
});

function setHttpCount(finished = false) {
  if (finished) {
    if (httpCount.value > 0) httpCount.value--;
    if (httpCount.value <= 0) uni.hideLoading();
  } else {
    httpCount.value++;
    if (httpCount.value > 0) uni.showLoading({ title: '加载中...', mask: true });
  }
}

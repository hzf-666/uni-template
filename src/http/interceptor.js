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
      new Promise((resolve, reject) => {
        req.cancelHttpCount = reject;
        setTimeout(() => {
          resolve();
        }, 100);
      }).then(() => {
        delete req.cancelHttpCount;
        setHttpCount();
      }).catch(() => {});
    }
  },
  success(res, config) {
    if (isWhite(config.apiURL, white.response)) return;

    const { apiURL, cancelHttpCount } = config;
    if (!isWhite(apiURL, white.httpCount)) {
      if (cancelHttpCount) {
        cancelHttpCount();
      } else {
        setHttpCount(true);
      }
    }

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

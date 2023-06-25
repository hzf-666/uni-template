import cache from '../utils/cache.js';
import { white } from './config.js';

const { httpCount } = storeToRefs(store.useGlobal());

let locking = true, lockTimer = null;
function lockDelay() {
  lockTimer && clearTimeout(lockTimer);
  locking = false;
  lockTimer = setTimeout(() => { // 15秒后重新加锁
    locking = true;
  }, 15000);
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
      // http.lock(res, config.args, async() => {
      //   await new Promise((resovle) => {
      //     setTimeout(() => {
      //       resovle({
      //         code: 200,
      //         message: '',
      //         data: {
      //           token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6ImFkbWluIiwicGFzc3dvcmQiOiJKai9zV0lZVVNhck1IREtLU3Y5a3IvVEdMZlNpMVFzL0lIK29tMjRrTEpxbmVPZW91dS8rK0Z0c3B0TG4zQmIvQ25ZTldjRThJNDlyemNNdmpPbk1ZZz09Iiwicm9sZUlkIjowLCJzdGF0ZUlkIjoxLCJhY2NvdW50VHlwZUlkIjoxLCJpYXQiOjE2ODc2ODIwNDUsImV4cCI6MTY4Nzc2ODQ0NX0.bW3fsIvYy_PnAXV_yEyb4-poYrx_MQGJ5jC_6mO815o',
      //         },
      //       });
      //     }, 100);
      //   }).then(res => {
      //     if (res.code == 200) {
      //       cache().set('token', res.data.token);
      //     }
      //   });
      //   lockDelay();
      //   http.unlock();
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
    if (httpCount.value > 0) uni.showLoading({ mask: true });
  }
}

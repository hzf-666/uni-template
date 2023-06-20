import cache from '../utils/cache.js';
import { white } from './config.js';

const { httpCount } = storeToRefs(store.useGlobal());

let flag = true, aaa = 0;

uni.addInterceptor('request', {
  invoke(req) {
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

    if ([401].includes(res.data.code)) {
      aaa++;
      flag = aaa < 3;
      // if (flag) {
      //   http.lock(res, config.args, async(once) => {
      //     if (once) await http.unlock();
      //   //   // console.log(once);
      //   //   // aaa++;
      //   //   // flag = false;
      //   //   // if (aaa >= 3) aaa = 0;
      //   //   // aaa++;
      //   //   if (once) {
      //   //     // flag = aaa < 3;
      //   //     http.unlock();
      //   //     // if (!flag) {
      //   //     //   flag = true;
      //   //     //   aaa = 0;
      //   //     // }
      //   //   }
      //   //   // await new Promise((aaa) => {
      //   //   //   setTimeout(() => {
      //   //   //     aaa();
      //   //   //     cache().set('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6ImFkbWluIiwicGFzc3dvcmQiOiJKai9zV0lZVVNhck1IREtLU3Y5a3IvVEdMZlNpMVFzL0lIK29tMjRrTEpxbmVPZW91dS8rK0Z0c3B0TG4zQmIvQ25ZTldjRThJNDlyemNNdmpPbk1ZZz09Iiwicm9sZUlkIjowLCJzdGF0ZUlkIjoxLCJhY2NvdW50VHlwZUlkIjoxLCJpYXQiOjE2ODcyMjQ5NDksImV4cCI6MTY4NzMxMTM0OX0.yRdqghPJvtfssTcY_-I5ybuB96yyPf0I3VpqJpMzpCc');
      //   //   //   }, 1500);
      //   //   // });
      //   //   // http.unlock();
      //   });
      // }
      if (!flag) {
        flag = true;
        aaa = 0;
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
    if (httpCount.value > 0) uni.showLoading({ mask: true });
  }
}

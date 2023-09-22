import './interceptor.js';
import { white, getHttpURL, isObj } from './config.js';

const { httpCount } = storeToRefs(store.useGlobal());

const uniFn = {
  request: uni.request,
  uploadFile: uni.uploadFile,
};

async function http([httpURL, options] = [], config) {
  const { baseURL, url } = getHttpURL(httpURL);

  options = {
    timeout: 15000,
    header: {},
    ...options,
    url: `${ baseURL }${ url }`,
    apiURL: url,
    method: typeof options?.method === 'string' ? options.method.toUpperCase() : 'GET',
    data: options?.body || options?.data,
    args: arguments,
  };
  config = {
    ...config,
    tipOptions: {
      show: true,
      success: '',
      fail: '',
      props: {},
      ...config?.tipOptions,
    },
  };

  handleOptions(options);

  if (http.isLock) {
    return new Promise(resolve => {
      http.lockList.push({ resolve, args: arguments });
    });
  }

  return handleHttp('request', { config, options, url });
}

['get', 'put', 'post', 'delete'].forEach(method => {
  http[method] = ([url, options] = [], config) => http([url, { ...options, method }], config);
});

http.isLock = false; http.lockList = [];
http.lock = function(res, args, callback) {
  if (isObj(res)) {
    res.data = new Promise(resolve => {
      http.lockList.push({ resolve, args });
    });
  }
  if (!http.isLock) {
    http.isLock = true;
    callback && callback();
  }
};
http.unlock = function() {
  return new Promise((resolve) => {
    setTimeout(async() => {
      http.isLock = false;
      Promise.all(http.lockList.map(({ args }) => http(...args))).then((resArr) => {
        resArr.forEach((res, i) => {
          http.lockList[i].resolve(res);
        });
        http.lockList = [];
        resolve();
      });
    });
  });
};

function showTip(msg, options = {}) {
  if (!msg) return;
  if (httpCount.value > 0) {
    httpCount.value = 0;
    uni.hideLoading();
  }
  uni.showToast({
    mask: true,
    duration: 1500,
    ...options,
    title: msg,
  });
}

http.upload = function([httpURL, options] = [], config) {
  const { baseURL, url } = getHttpURL(httpURL);

  options = {
    header: {
      Authorization: cache().get('token'),
      ...options?.header,
    },
    name: 'file',
    ...options,
    url: `${ baseURL }${ url }`,
    formData: options?.body || options?.formData,
  };
  config = {
    ...config,
    tipOptions: {
      show: true,
      success: '',
      fail: '',
      props: {},
      ...config?.tipOptions,
    },
  };

  handleOptions(options);

  return handleHttp('uploadFile', { config, options, url });
};

function handleOptions(options) {
  if (isObj(options.params)) {
    const arr = [];
    for (const k in options.params) {
      arr.push(`${ k }=${ options.params[k] }`);
    }
    if (arr.length) {
      options.url = `${ options.url }${ options.url.includes('?') ? '&' : '?' }${ arr.join('&') }`;
    }
  }
  if (options.body) delete options.body;
  if (options.method === 'GET') delete options.data;
}
function handleHttp(type, { config, options, url } = {}) {
  return new Promise((resolve) => {
    let result = { code: 0, data: {}, message: '无法连接服务器！' }, isShowTip = false, tipProps = {};
    isShowTip = config?.tipOptions?.show;
    tipProps = config?.tipOptions?.props;

    const successTip = config?.tipOptions?.success, failTip = config?.tipOptions?.fail;

    uniFn[type]({
      ...options,
      success({ statusCode, data }) {
        result = statusCode == 200
          ? data && typeof data === 'string' ? JSON.parse(data) : data
          : { code: statusCode, data: {}, message: '请求服务器出错！错误状态码：' + statusCode };
      },
      complete() {
        if (result.code == 200) {
          tipProps.icon = 'success';
          if (successTip) result.message = successTip;
        } else {
          tipProps.icon = 'none';
          if (failTip) result.message = failTip;
        }
        if (isWhite(url, white.message)) result.message = '';
        if (isShowTip) showTip(result.message, tipProps);
        resolve(result);
      },
    });
  });
}

export default http;

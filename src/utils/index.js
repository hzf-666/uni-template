import dayjs from 'dayjs';
import Mexp from 'math-expression-evaluator';
import CryptoJS from 'crypto-js';
import _cache from './cache.js';
import _regex from './regex.js';

export const dayjsFormat = ({ date, format = 'YYYY-MM-DD HH:mm' } = {}) => dayjs(date).format(format);
export const mexp = new Mexp();
mexp._eval = mexp.eval;
mexp.eval = (...args) => mexp._eval(...args).toFixed(10) - 0;
export const psw = str => str ? CryptoJS.SHA512(str).toString(CryptoJS.enc.Base64) : '';
export const cache = _cache;
export const regex = _regex;

export function typeOf(target, type) { // 判断数据类型
  /**
   * undefined
   * null
   * string
   * number
   * boolean
   * object
   * array
   * function
   * asyncFunction
   * regExp
   * date
   */
  const value = Object.prototype.toString.call(target).replace(/^\[object (.*)\]$/, (...args) => args[1][0].toLowerCase() + args[1].substring(1)),
    test = () => {
      if (typeof type !== 'string') return false;
      if (value === 'asyncFunction' && type === 'function') return true;
      return type === value;
    };
  return type === undefined ? value : test();
}

export function deepCopy(target) { // 数据深拷贝
  let result;
  const isObject = (val) => Object.prototype.toString.call(val) === '[object Object]';
  if (Array.isArray(target)) {
    result = [];
  } else if (isObject(target)) {
    result = {};
  } else {
    result = target;
    return result;
  }
  for (const i in target) {
    result[i] = Array.isArray(target[i]) || isObject(target[i]) ? deepCopy(target[i]) : target[i];
  }
  return result;
}

export function recursion(tree = [], callback, { children = 'children', parent = null } = {}) { // 树形递归
  if (!(Array.isArray(tree) && tree.length)) return;
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i], itemChildren = item[children],
      result = callback && callback(item, parent);
    if (result === 'break') return true;
    if (result === 'continue') continue;
    if (itemChildren?.length) {
      if (recursion(itemChildren, callback, { children, parent: item })) return true;
    }
  }
}

export function delayPromise(promise, delay = 1000) {
  return new Promise((resolve, reject) => {
    Promise.all([promise, new Promise((rs) => {
      setTimeout(rs, delay);
    })]).then(res => resolve(res[0])).catch(reject);
  });
}

export function debounce(fn, delay) { // 防抖函数
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(fn, delay) { // 节流函数
  let timerId;
  return function(...args) {
    if (!timerId) {
      timerId = setTimeout(() => {
        fn.apply(this, args);
        timerId = null;
      }, delay);
    }
  };
}

export function els(i) {
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': i,
  };
}

export function rx(size) {
  size = Number(size);
  if (isNaN(size)) return '';
  return `${ size * (750 / standardWidth) }rpx`;
}

export function openUrl(...args) {
  if (!args[0]) return;

  // #ifdef H5
  window.open(...args);
  // #endif

  // #ifndef H5
  const [url, options = {}, { success, fail } = {}] = args;
  const getHeaderArray = target => {
    if (typeof target === 'string') {
      return target.split(';');
    }
    return target;
  };
  if (!options.duration) options.duration = 500;
  uni.showToast({ icon: 'loading', title: '正在打开...', mask: true, ...options });
  delayPromise(new Promise(resolve => {
    uni.downloadFile({
      url,
      success: (e) => {
        if (e.statusCode != 200) return;
        resolve(e);
      },
      complete: (e) => {
        if (e.statusCode == 200) return;
        resolve(e);
      },
    });
  }), options.duration).then((res) => {
    if (res.statusCode == 200) {
      const contentType = getHeaderArray(res.header['Content-Type']);
      if (!contentType) return uni.showToast({ icon: 'none', title: '无效文件' });
      const [mime] = contentType[0].split('/');
      const opts = {
        success() {
          uni.hideToast();
          success?.();
        },
        fail() {
          uni.showToast({ icon: 'none', title: '打开失败' });
          fail?.();
        },
      };
      if (mime == 'image') {
        uni.previewImage({ urls: [url], ...opts });
      } else {
        uni.openDocument({ filePath: res.tempFilePath, showMenu: true, ...opts });
      }
    } else {
      console.error(res);
      uni.showToast({ icon: 'none', title: '文件路径无法打开' });
      fail?.();
    }
  });
  // #endif
}

export function closeUrl(...args) {
  window.close(...args);
}

export function downloadUrl(url, { success, fail } = {}) {
  // #ifdef H5
  fetch(url).then(response => response.blob()).then(blob => {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = url.replace(/.*\//, '');
    link.style.position = 'fixed';
    link.style.zIndex = -999;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
    success?.();
  }).catch(() => {
    console.error('下载失败');
    fail?.();
  });
  // #endif

  // #ifndef H5
  openUrl(url, { icon: 'none', title: '打开文件后请手动保存下载', duration: 1500 });
  // #endif
}

export function isEqual(source, comparison) { // 判断两个数据是否完全相等
  const getType = target => Object.prototype.toString.call(target),
    iterable = data => Array.isArray(data) || getType(data) === '[object Object]';
  if (!iterable(source)) {
    return source === comparison;
  }
  if (getType(source) !== getType(comparison)) {
    return false;
  }
  const sourceKeys = Object.keys(source),
    comparisonKeys = Object.keys({ ...source, ...comparison });
  if (sourceKeys.length !== comparisonKeys.length) {
    return false;
  }
  return !comparisonKeys.some(key => {
    if (iterable(source[key])) {
      return !isEqual(source[key], comparison[key]);
    } else {
      return source[key] !== comparison[key];
    }
  });
}

export function isWhite(target, list = []) {
  let flag = false;
  for (const item of list) {
    if (typeof item === 'string') {
      flag = target === item;
    } else if (Object.prototype.toString.call(item) === '[object RegExp]') {
      flag = item.test(target);
    }
    if (flag) break;
  }
  return flag;
}

export function numberToChinese(number) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chineseUnits = ['', '十', '百', '千', '万', '亿'];
  let result = '';
  const numberString = String(number);
  for (let i = 0; i < numberString.length; i++) {
    const digit = parseInt(numberString.charAt(i));
    result += chineseNumbers[digit] + chineseUnits[numberString.length - i - 1];
  }
  return result;
}

export function setClass(val) {
  switch (typeOf(val)) {
    case 'string':
      return val.split(' ');
    case 'array':
      return val;
    default:
      return [val];
  }
}

export function setStyle(val) {
  if (typeOf(val, 'string')) {
    const obj = {};
    val.split(';').forEach(item => {
      if (!item.trim()) return;
      const arr = item.split(':'), key = arr[0].trim(), value = arr[1].trim();
      try {
        obj[key] = JSON.parse(value);
      } catch {
        obj[key] = value;
      }
    });
    return obj;
  }
  return val;
}

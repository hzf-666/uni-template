const baseUrl = '/api/inner/common';

export function getApiList(options, config) { // 接口 - 列表
  config = { ...config, tipOptions: {
    success: '',
    fail: '',
    ...config?.tipOptions,
  } };
  return http.get([`${ baseUrl }`, options], config);
}

export function uploadFile(options, config) { // 上传文件
  config = { ...config, tipOptions: {
    success: '',
    fail: '',
    ...config?.tipOptions,
  } };
  return http.upload([config.action || `${ baseUrl }/upload`, options], config);
}

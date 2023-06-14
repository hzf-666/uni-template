// 添加请求拦截器
uni.interceptors.request.use((config) => {
  // console.log('请求拦截器', config);

  // // 在请求头添加token
  // const token = uni.getStorageSync('token');
  // if (token) {
  //   config.header.Authorization = `Bearer ${ token }`;
  // }

  return config;
});

// 添加响应拦截器
uni.interceptors.response.use((response) => {
  // console.log('响应拦截器', response);

  // // 处理错误状态码
  // if (response.statusCode !== 200) {
  //   uni.showToast({
  //     title: '网络错误，请稍后重试',
  //     icon: 'none'
  //   });
  // }

  return response.data;
});

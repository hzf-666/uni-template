function http([httpURL, options] = [], config) {
  return new Promise((resolve) => {
    resolve(666);
  });
}

['get', 'put', 'post', 'delete'].forEach(method => {
  http[method] = ([url, options] = [], config) => http([url, { ...options, method }], config);
});

export default http;

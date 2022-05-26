const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/rest',
    createProxyMiddleware({
      target: 'https://sige.emmanuel.pe',
      changeOrigin: true,
    })
  );
};
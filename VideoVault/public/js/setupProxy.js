// setupProxy.js i din frontend
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/save-video',
    createProxyMiddleware({
      target: 'http://192.168.0.35:3001', // Backend-adress
      changeOrigin: true,
    })
  );
};
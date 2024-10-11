const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ton-api',
    createProxyMiddleware({
      target: 'https://testnet-rpc.tonxapi.com',
      changeOrigin: true,
      pathRewrite: {
        '^/ton-api': '', // Removes '/ton-api' from the request path
      },
      headers: {
        'x-api-key': '55c5f534-ae22-42a3-9abc-7664c662444a'
      }
    })
  );
};
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Local dev default: backend on localhost:8000
  // Docker Compose: set REACT_APP_PROXY_TARGET=http://backend:8000
  const target = process.env.REACT_APP_PROXY_TARGET || "http://localhost:8000";

  app.use(
    "/predict",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};


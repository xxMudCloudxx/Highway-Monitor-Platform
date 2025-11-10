// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteMockServe({
      mockPath: "mock",
      enable: true, // 保证开发环境下启用
    }),
  ],

  // (重要) 配置代理，为阶段三（联调）做准备
  // 现在用 mock，但将来联调时，我们会关闭 mock (enable: false)
  // 并打开下面的代理，将请求转发给同学B和C的真实服务器
  // server: {
  //   proxy: {
  //     // 代理同学B (后端-主) 的接口
  //     "/api/query": {
  //       target: "http://db-app:5000", // 目标服务器
  //       changeOrigin: true,
  //     },
  //     "/api/stats": {
  //       target: "http://db-app:5000",
  //       changeOrigin: true,
  //     },
  //     // 代理同学C (算法-辅) 的接口
  //     "/api/warnings": {
  //       target: "http://pipeline-algo:5001",
  //       changeOrigin: true,
  //     },
  //     "/api/predict": {
  //       target: "http://pipeline-algo:5001",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});

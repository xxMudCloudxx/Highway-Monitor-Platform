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
      enable: false, // 保证开发环境下启用
    }),
  ],

  server: {
    port: 5173, // 前端端口
    proxy: {
      // 关键配置：所有以 /api 开头的请求，都会转发给 Python 后端
      "/api": {
        target: "http://121.196.226.161:5000", // 同学B的后端地址
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});

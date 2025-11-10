// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css"; // (包含 Tailwind v4)

// 1. 导入我们的布局和页面
import { AppLayout } from "./components/common/Layout";
import { DataScreen } from "./pages/DataScreen";
// (注意) 导入 QueryPageWrapper，它已经包含了 Antd App
import QueryPageWrapper from "./pages/QueryPage";

// 2. (核心) 定义路由
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // 使用我们的布局
    children: [
      {
        path: "/", // 默认路径 (e.g., localhost:5173/)
        element: <DataScreen />, // 显示数据大屏
      },
      {
        path: "/query", // e.g., localhost:5173/query
        element: <QueryPageWrapper />, // 显示交互式查询页
      },
    ],
  },
]);

// 3. (修改) 不再渲染 <App />，而是渲染 <RouterProvider />
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

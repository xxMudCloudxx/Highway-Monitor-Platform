/**
 * @file src/components/common/Layout.tsx
 * @module AppLayout
 * @description (组件) 全局根布局
 * * 职责:
 * 1. 提供顶部导航栏 (NavLink)，用于在 "大屏" 和 "查询页" 间切换。
 * 2. 提供 <Outlet /> (react-router-dom) 路由出口。
 * 3. (关键) 全局包裹 Antd ConfigProvider，统一设置暗黑主题。
 */

import { Outlet, NavLink } from "react-router-dom";
import { ConfigProvider, theme } from "antd";

/**
 * 全局根布局组件
 * @returns {React.ReactElement}
 */
export const AppLayout = () => {
  /**
   * (Helper) NavLink 动态样式
   * @param {object} props
   * @param {boolean} props.isActive - react-router 注入的
   * @returns {string} Tailwind v4 样式
   */
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md ${
      isActive
        ? "bg-cyan-600 text-white" // (激活)
        : "text-gray-300 hover:bg-gray-700 hover:text-white" // (未激活)
    }`;

  return (
    // 3. (Antd) 全局暗黑主题
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="flex flex-col h-screen w-screen bg-[#141414]">
        {/* 1. 顶部导航栏 */}
        <nav className="w-full h-12 bg-[#1f1f1f] flex items-center p-4 shadow-lg z-10">
          <h1 className="text-xl text-cyan-400 font-bold mr-6">
            徐州市实时流量预测平台
          </h1>
          <div className="flex gap-4">
            <NavLink to="/" className={navLinkClass}>
              数据大屏
            </NavLink>
            <NavLink to="/query" className={navLinkClass}>
              交互式查询
            </NavLink>
          </div>
        </nav>

        {/* 2. 路由出口：(页面内容将在这里渲染) */}
        <main className="flex-1 overflow-auto">
          <Outlet /> {/* (DataScreen 或 QueryPage 将在这里显示) */}
        </main>
      </div>
    </ConfigProvider>
  );
};

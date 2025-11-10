// src/components/common/Layout.tsx
import { Outlet, NavLink } from "react-router-dom";
import { ConfigProvider, theme } from "antd";

export const AppLayout = () => {
  // NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md ${
      isActive
        ? "bg-cyan-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    // (重要) 我们在根布局上启用 Antd 的暗黑主题
    // 这样 QueryPage 就不需要再次包裹 ConfigProvider 了
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="flex flex-col h-screen w-screen bg-[#141414]">
        {/* 顶部导航栏 */}
        <nav className="w-full h-12 bg-[#1f1f1f] flex items-center p-4 shadow-lg z-10">
          <h1 className="text-xl text-cyan-400 font-bold mr-6">
            高速公路监控平台
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

        {/* 路由出口：页面内容将在这里渲染 */}
        {/* 我们让内容区域占满剩余高度 */}
        <main className="flex-1 overflow-auto">
          <Outlet /> {/* DataScreen 或 QueryPage 将在这里显示 */}
        </main>
      </div>
    </ConfigProvider>
  );
};

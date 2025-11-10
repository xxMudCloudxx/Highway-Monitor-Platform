// src/pages/DataScreen.tsx
import { useEffect } from "react";
import { useDataScreenStore } from "../stores/useDataScreenStore";

// (导入我们所有的 6 个组件)
import { HourlyFlowChart } from "../components/charts/HourlyFlowChart";
import { KkmcRankingChart } from "../components/charts/KkmcRankingChart";
import { SourceMapChart } from "../components/charts/SourceMapChart";
import { RealtimeWarningList } from "../components/common/RealtimeWarningList";
import { PredictionCard } from "../components/common/PredictionCard";
import { SourcePieChart } from "../components/charts/SourcePieChart";

// (统一的 Panel 封装，保持风格一致)
const Panel: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string; // (允许传入 Tailwind 类)
}> = ({ title, children, className = "" }) => (
  <div
    className={`border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col ${className}`}
  >
    <h2 className="text-lg text-center shrink-0 text-cyan-300 mb-2">{title}</h2>
    <div className="flex-1 h-[calc(100%-40px)]">{children}</div>
  </div>
);

export const DataScreen = () => {
  const { fetchAllData } = useDataScreenStore();

  useEffect(() => {
    // (定时器 逻辑不变)
    fetchAllData();
    const timerId = setInterval(() => fetchAllData(), 30 * 1000);
    return () => clearInterval(timerId);
  }, [fetchAllData]);

  return (
    <div className="bg-[#0F1A3D] text-white w-full h-full p-5 box-border overflow-hidden">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
        高速公路实时车流监控
      </h1>

      {/* (核心布局) 1:2:1 
        我们使用 grid-cols-4
        h-[calc(100%-50px)] 是为了减去顶部 H1 的高度 
      */}
      <div className="w-full h-[calc(100%-50px)] grid grid-cols-4 gap-4">
        {/* --- 左侧栏 (col-span-1) --- 
          (使用 flex-col 让内部 2 个 Panel 均分高度)
        */}
        <div className="col-span-1 h-full flex flex-col gap-4">
          <Panel title="24小时流量曲线 (API 3)" className="flex-1">
            <HourlyFlowChart />
          </Panel>
          <Panel title="卡口流量 Top 10 (API 2)" className="flex-1">
            <KkmcRankingChart />
          </Panel>
        </div>

        {/* --- 中间栏 (col-span-2) ---
          (使用 flex-col 让内部 2 个 Panel 均分高度)
        */}
        <div className="col-span-2 h-full flex flex-col gap-4">
          <Panel title="车辆来源分布 (API 4)" className="flex-2">
            <SourceMapChart />
          </Panel>
          <Panel title="未来流量预测 (API 6)" className="flex-1">
            <PredictionCard />
          </Panel>
        </div>

        {/* --- 右侧栏 (col-span-1) ---
          (使用 flex-col 让内部 2 个 Panel 均分高度)
        */}
        <div className="col-span-1 h-full flex flex-col gap-4">
          <Panel title="车辆来源占比 (API 4 复用)" className="flex-1">
            <SourcePieChart />
          </Panel>

          <Panel title="实时套牌车告警 (API 5)" className="flex-1">
            <RealtimeWarningList />
          </Panel>
        </div>
      </div>
    </div>
  );
};

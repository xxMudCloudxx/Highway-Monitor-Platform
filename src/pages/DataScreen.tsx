/**
 * @file src/pages/DataScreen.tsx
 * @module DataScreen
 * @description (页面) 最终版 1:2:1 "黄金布局" 数据大屏
 *
 * 职责:
 * 1. 按照 "1:2:1" 黄金比例 布局 (grid-cols-4)。
 * 2. 组装所有 6 个图表/组件。
 * 3. (核心) 设置 30s 定时器，周期性调用 zustand store 的 fetchAllData action。
 * 4. (Smart Container) 从 Zustand Store 获取所有数据并通过 props 传递给子组件。
 */

import { useEffect } from "react";
import { useDataScreenStore } from "../stores/useDataScreenStore";

// (导入我们所有的 6 个组件)
import { HourlyFlowChart } from "../components/charts/HourlyFlowChart";
import { KkmcRankingChart } from "../components/charts/KkmcRankingChart";
import { SourceMapChart } from "../components/charts/SourceMapChart";
import { RealtimeWarningList } from "../components/common/RealtimeWarningList";
import { SourcePieChart } from "../components/charts/SourcePieChart";
import VehicleTypeChart from "../components/charts/VehicleTypeChart";

/**
 * (私有) 统一面板封装组件
 *
 * @param {object} props - 组件属性
 * @param {string} props.title - 面板标题
 * @param {React.ReactNode} props.children - 内容
 * @param {string} [props.className] - 额外的 Tailwind v4 类
 * @returns {React.ReactElement}
 */
const Panel: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  // (使用 Tailwind v4 的 @apply 语义化)
  <div
    className={`border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col ${className}`}
  >
    <h2 className="text-lg text-center shrink-0 text-cyan-300 mb-2">{title}</h2>
    {/* (使用 h-[calc(100%-40px)] 确保 Echarts 图表容器能自适应) */}
    <div className="flex-1 h-[calc(100%-40px)]">{children}</div>
  </div>
);

/**
 * 数据大屏页面
 * @returns {React.ReactElement}
 */
export const DataScreen = () => {
  // 1. (Zustand) 获取 Action 和所有数据
  const {
    fetchAllData,
    hourCount,
    kkmcRank,
    mapData,
    vehicleTypeData,
    vehicleBrandData,
  } = useDataScreenStore();

  // 2. (React Hook) 设置定时器
  useEffect(() => {
    // 页面首次加载时，立即获取一次数据，防止空白
    fetchAllData();

    // 设置 30s 定时器，实现"每半分钟一次对结果进行刷新"
    const timerId = setInterval(() => {
      console.log("触发 30s 定时刷新...");
      fetchAllData();
    }, 30 * 1000);

    // 组件卸载时，必须清除定时器，防止内存泄漏
    return () => {
      clearInterval(timerId);
    };
  }, [fetchAllData]); // (依赖项为 zustand action，仅在挂载时运行一次)

  // 3. (渲染)
  return (
    <div className="bg-[#0F1A3D] text-white w-full h-full p-5 box-border overflow-hidden">
      {/* (核心布局) 1:2:1 黄金比例
        (使用 grid-cols-4)
        (h-[calc(100%-50px)] 是为了减去顶部 H1 的高度)
        */}
      <div className="w-full h-[calc(100%-50px)] grid grid-cols-4 gap-4">
        {/* --- 左侧栏 (col-span-1) --- 
          (2 个组件, flex-1 均分高度)
          */}
        <div className="col-span-1 h-full flex flex-col gap-4">
          <Panel title="24小时流量曲线" className="flex-1">
            <HourlyFlowChart data={hourCount} />
          </Panel>
          <Panel title="卡口流量 Top 10" className="flex-1">
            <KkmcRankingChart data={kkmcRank} />
          </Panel>
        </div>

        {/* --- 中间栏 (col-span-2) ---
          (2 个组件, 地图占比最大)
          */}
        <div className="col-span-2 h-full flex flex-col gap-4">
          <Panel title="车辆来源分布" className="flex-2">
            <SourceMapChart data={{ districts: mapData, stations: kkmcRank }} />
          </Panel>
          <Panel title="实时套牌车告警" className="flex-1">
            <RealtimeWarningList />
          </Panel>
          {/* <Panel title="未来流量预测 (API 6 mock)" className="flex-1">
              <PredictionCard />
            </Panel> */}
        </div>

        {/* --- 右侧栏 (col-span-1) ---
          (2 个组件, flex-1 均分高度)
          */}
        <div className="col-span-1 h-full flex flex-col gap-4">
          <Panel title="车辆品牌分布" className="flex-1">
            <VehicleTypeChart data={vehicleBrandData} />
          </Panel>
          <Panel title="车辆类型分布" className="flex-1">
            <VehicleTypeChart data={vehicleTypeData} />
          </Panel>
          <Panel title="车辆来源占比" className="flex-1">
            <SourcePieChart data={mapData} />
          </Panel>
        </div>
      </div>
    </div>
  );
};

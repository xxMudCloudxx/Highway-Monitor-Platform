// src/pages/DataScreen.tsx
import { useEffect } from "react";
import { useDataScreenStore } from "../stores/useDataScreenStore";
import { HourlyFlowChart } from "../components/charts/HourlyFlowChart";
import { KkmcRankingChart } from "../components/charts/KkmcRankingChart";
import { SourceMapChart } from "../components/charts/SourceMapChart";

export const DataScreen = () => {
  const { fetchAllData } = useDataScreenStore();

  useEffect(() => {
    // ... (定时器逻辑保持不变)
    fetchAllData();
    const timerId = setInterval(() => fetchAllData(), 30 * 1000); // 30秒刷新
    return () => clearInterval(timerId);
  }, [fetchAllData]);

  return (
    <div className="bg-[#0F1A3D] text-white w-screen h-screen p-5 box-border overflow-hidden">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
        高速公路实时车流监控
      </h1>

      {/* 使用 Flex 布局 */}
      <div className="flex w-full h-[calc(100%-50px)] gap-4">
        {/* 左侧容器 (占 1/3 宽度) */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex-1 border border-[#3B4B6F] bg-[#142047]/50 p-2">
            <h2 className="text-lg text-center">24小时流量曲线</h2>
            <div className="h-[calc(100%-32px)]">
              <HourlyFlowChart />
            </div>
          </div>

          <div className="flex-1 border border-[#3B4B6F] bg-[#142047]/50 p-2">
            <h2 className="text-lg text-center">卡口流量 Top 10</h2>
            <div className="h-[calc(100%-32px)]">
              <KkmcRankingChart />
            </div>
          </div>
        </div>

        {/* 右侧容器 (占 2/3 宽度，给地图更大空间) */}
        <div className="w-2/3 border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col">
          <h2 className="text-lg text-center">车辆来源分布 (热力图)</h2>
          <div className="flex-1 h-[calc(100%-32px)]">
            {" "}
            {/* <-- 2. 放入地图组件 */}
            <SourceMapChart />
          </div>
        </div>
      </div>
    </div>
  );
};

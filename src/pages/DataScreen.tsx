// src/pages/DataScreen.tsx
import { useEffect } from "react";
import { useDataScreenStore } from "../stores/useDataScreenStore";
import { HourlyFlowChart } from "../components/charts/HourlyFlowChart";
import { KkmcRankingChart } from "../components/charts/KkmcRankingChart";
import { SourceMapChart } from "../components/charts/SourceMapChart";
import { RealtimeWarningList } from "../components/common/RealtimeWarningList"; // <-- 1. 导入

export const DataScreen = () => {
  const { fetchAllData } = useDataScreenStore();

  useEffect(() => {
    // ... (定时器逻辑保持不变)
    fetchAllData();
    const timerId = setInterval(() => fetchAllData(), 30 * 1000);
    return () => clearInterval(timerId);
  }, [fetchAllData]);

  return (
    <div className="bg-[#0F1A3D] text-white w-screen h-screen p-5 box-border overflow-hidden">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
        高速公路实时车流监控
      </h1>

      <div className="flex w-full h-[calc(100%-50px)] gap-4">
        {/* 左侧容器 (w-1/3) - 改为 h-full 且 flex-col */}
        <div className="w-1/3 h-full flex flex-col gap-4">
          {/* 2. (修改) 上: 1/3 高度 */}
          <div className="h-1/3 border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col">
            <h2 className="text-lg text-center shrink-0">24小时流量曲线</h2>
            <div className="flex-1 h-[calc(100%-32px)]">
              <HourlyFlowChart />
            </div>
          </div>

          {/* 3. (修改) 中: 1/3 高度 */}
          <div className="h-1/3 border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col">
            <h2 className="text-lg text-center shrink-0">卡口流量 Top 10</h2>
            <div className="flex-1 h-[calc(100%-32px)]">
              <KkmcRankingChart />
            </div>
          </div>

          {/* 4. (新增) 下: 1/3 高度 */}
          <div className="h-1/3 border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col">
            <h2 className="text-lg text-center shrink-0">实时套牌车告警</h2>
            <div className="flex-1 h-[calc(100%-32px)]">
              <RealtimeWarningList />
            </div>
          </div>
        </div>

        {/* 右侧容器 (w-2/3) - 保持不变 */}
        <div className="w-2/3 border border-[#3B4B6F] bg-[#142047]/50 p-2 flex flex-col">
          <h2 className="text-lg text-center shrink-0">
            车辆来源分布 (热力图)
          </h2>
          <div className="flex-1 h-[calc(100%-32px)]">
            <SourceMapChart />
          </div>
        </div>
      </div>
    </div>
  );
};

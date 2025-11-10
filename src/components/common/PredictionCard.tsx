// src/components/common/PredictionCard.tsx
import { useDataScreenStore } from "../../stores/useDataScreenStore";
import { ChartBarSquareIcon, ClockIcon } from "@heroicons/react/24/outline"; // (pnpm add @heroicons/react)

export const PredictionCard = () => {
  // 1. 从 zustand store 中获取 [接口 6] 的数据
  const { prediction } = useDataScreenStore();

  // 2. 简单的 Loading 态
  if (!prediction) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        预测数据加载中...
      </div>
    );
  }

  return (
    // (我们使用 Tailwind v4 来美化这个卡片)
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-b from-[#142047]/50 to-transparent">
      {/* 标题 */}
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <ClockIcon className="w-4 h-4 mr-1" />
        <span>{prediction.hour}:00 点车流量预测</span>
      </div>

      {/* 预测值 (大数字) */}
      <div className="text-5xl font-bold text-cyan-400 mb-4">
        {prediction.predicted_flow}
        <span className="text-lg ml-2">辆</span>
      </div>

      {/* 预测范围 */}
      <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
        <ChartBarSquareIcon className="w-4 h-4 mr-1" />
        <span>预测卡口: {prediction.kkmc}</span>
      </div>
    </div>
  );
};

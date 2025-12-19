/**
 * @file src/components/common/RealtimeWarningList.tsx
 * @module RealtimeWarningList
 * @description (组件) 大屏滚动列表: 实时套牌车告警
 * * 职责:
 * 1. 消费 zustand store 中的 `realtimeWarnings` (API 5)。
 * 2. 渲染一个自动向上无缝滚动的列表。
 */

import { useDataScreenStore } from "../../stores/useDataScreenStore";
import { BellIcon } from "@heroicons/react/24/solid";

/**
 * 实时套牌车告警 (API 5) 滚动列表
 * @returns {React.ReactElement}
 */

export const RealtimeWarningList = () => {
  const { realtimeWarnings } = useDataScreenStore();

  return (
    // 1. 设置固定高度 (如 h-[400px])
    // 2. 移除 animate-scroll-y (如果改为手动滚动/溢出显示)
    // 3. 增加 custom-scrollbar 样式 (需在 index.css 定义)
    <div className="w-full h-[420px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
      <div className="flex flex-col gap-2">
        {realtimeWarnings.map((warning, index) => (
          <div
            key={index}
            className="flex flex-col p-3 border-b border-[#3B4B6F]/30 bg-red-500/5 hover:bg-red-500/10 transition-colors"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <BellIcon className="w-4 h-4 text-red-500 mr-2" />
                {/* 这里的 warning.hphm 现在会显示后端传来的原始字符串 */}
                <span className="text-red-400 font-mono font-bold text-base tracking-widest">
                  {warning.hphm}
                </span>
              </div>
              <span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                套牌预警
              </span>
            </div>

            <div className="text-xs text-gray-300 leading-relaxed bg-[#1a2333] p-2 rounded mt-1">
              <span className="text-gray-500">轨迹：</span>
              {warning.msg}
            </div>

            <div className="flex justify-between mt-2 text-[10px] text-gray-500 italic">
              <span>时间: {warning.time}</span>
              <span className="text-yellow-600 font-bold">
                {warning.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

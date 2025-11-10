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
  // 1. (Zustand) 获取 [接口 5] 数据
  const { realtimeWarnings } = useDataScreenStore();

  // 2. (关键)
  // Why: 为了实现无缝滚动，我们将列表数据复制一份。
  // (当第一份滚动到末尾时，第二份无缝衔接，然后动画重置)
  const displayWarnings = [...realtimeWarnings, ...realtimeWarnings];

  return (
    <div className="w-full h-full overflow-hidden">
      {/* 3. (Tailwind v4)
        (animate-scroll-y 是在 tailwind.config.js 中定义的)
        (hover:[animation-play-state:paused] 实现了 Hober 暂停)
       */}
      <div
        className="animate-scroll-y hover:[animation-play-state:paused]"
        // (动态设置动画时长，防止数据太少时滚动过快)
        style={{ animationDuration: `${realtimeWarnings.length * 2.5}s` }} // (e.g., 10条数据 25s)
      >
        {displayWarnings.map((warning, index) => (
          <div
            key={index}
            className="flex items-center p-2 border-b border-[#3B4B6F]/50"
          >
            <BellIcon className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
            <span className="text-sm text-gray-300 truncate">{warning}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

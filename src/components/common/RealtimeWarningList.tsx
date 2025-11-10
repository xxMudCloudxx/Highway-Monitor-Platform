// src/components/common/RealtimeWarningList.tsx
import { useDataScreenStore } from "../../stores/useDataScreenStore";
import { BellIcon } from "@heroicons/react/24/solid"; // 我们可以用 heroicons 增加点缀

// (如果你还没装 heroicons: pnpm add @heroicons/react)

export const RealtimeWarningList = () => {
  // 1. 从 zustand store 中获取实时告警数据
  const { realtimeWarnings } = useDataScreenStore();

  // (如果列表项太少，滚动效果会不好，Mock 时可以增加 mock/algoApp.ts 的返回数量)

  // 2. (关键) 为了实现无缝滚动，我们将列表数据复制一份
  const displayWarnings = [...realtimeWarnings, ...realtimeWarnings];

  return (
    <div className="w-full h-full overflow-hidden">
      {/* 3. 使用 animation-play-state 来实现 hover 时暂停 */}
      <div
        className="animate-scroll-y hover:[animation-play-state:paused]"
        // 我们需要内联 style 来动态设置动画时长，防止数据太少时滚动过快
        // (这里我们用 30s 固定值，你也可以根据 realtimeWarnings.length 动态计算)
        style={{ animationDuration: "30s" }}
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

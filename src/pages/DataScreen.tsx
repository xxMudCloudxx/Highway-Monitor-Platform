// src/pages/DataScreen.tsx
import { useEffect } from "react";
import { HourlyFlowChart } from "../components/charts/HourlyFlowChart";
import { useDataScreenStore } from "../store/useDataScreenStore";

// 这是我们的数据大屏
export const DataScreen = () => {
  // 1. 从 store 中获取 fetchAllData 这个 action
  const { fetchAllData } = useDataScreenStore();

  useEffect(() => {
    // 2. 页面首次加载时，立即执行一次数据获取
    fetchAllData();

    // 3. (核心需求) 设置定时器，实现“每半分钟一次对结果进行刷新”
    //    (参考: 大数据存储案例设计要求.doc, 课设项目策划书.md)
    const timerId = setInterval(() => {
      console.log("触发 30s 定时刷新...");
      fetchAllData();
    }, 30 * 1000); // 30秒

    // 4. (重要) 组件卸载时，必须清除定时器，防止内存泄漏
    return () => {
      clearInterval(timerId);
    };

    // 注意：useEffect 的依赖项为空数组，确保此 effect 仅在挂载时运行一次
  }, [fetchAllData]);

  return (
    <div
      style={{
        background: "#0F1A3D", // 大屏的深色背景
        color: "white",
        width: "100vw",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1>高速公路实时车流监控</h1>

      {/* 我们把图表放在一个固定大小的容器里 */}
      <div
        style={{
          width: "500px",
          height: "300px",
          border: "1px solid #3B4B6F",
        }}
      >
        <HourlyFlowChart />
      </div>

      {/* ... (未来在这里添加其他图表) ... */}
    </div>
  );
};

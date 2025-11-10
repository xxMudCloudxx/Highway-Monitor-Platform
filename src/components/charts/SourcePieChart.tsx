// src/components/charts/SourcePieChart.tsx
import ReactECharts from "echarts-for-react";
import { useDataScreenStore } from "../../stores/useDataScreenStore";

export const SourcePieChart = () => {
  // 1. (关键) 复用 [接口 4] 的数据
  const { mapData } = useDataScreenStore();

  // 2. (参考 react-big-data) 定义 Echarts 环形图 Option
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} 辆 ({d}%)", // 提示框：省份 : 123 辆 (12.3%)
    },
    // (图例) 为了不让图表太挤，我们只显示 Top 6 的图例
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: {
        color: "#B5C5DB",
      },
      data: mapData.slice(0, 6).map((item) => item.name), // 只取前6个省份
    },
    series: [
      {
        name: "车辆来源",
        type: "pie",
        // (环形图) '40%' 是内圈, '60%' 是外圈
        radius: ["40%", "60%"],
        // (位置) 将饼图向右推，给左侧的图例留出空间
        center: ["65%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: false, // 不在图上显示标签
          position: "center",
        },
        emphasis: {
          // (高亮) 鼠标悬浮时在中心显示
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
            formatter: "{b}\n{d}%", // (e.g., 广东 30.5%)
          },
        },
        labelLine: {
          show: false,
        },
        // (数据绑定) API.md 的 [{name, value}] 格式完美契合
        data: mapData,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

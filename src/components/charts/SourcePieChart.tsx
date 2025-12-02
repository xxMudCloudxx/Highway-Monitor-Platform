/**
 * @file src/components/charts/SourcePieChart.tsx
 * @module SourcePieChart
 * @description (组件) Echarts 环形图: 车辆来源占比
 * * 职责:
 * 1. 接收父组件传递的 `data` (API 4)。
 * 2. 渲染 Echarts 环形图。
 */

import ReactECharts from "echarts-for-react";

/**
 * 车辆来源数据接口
 */
interface SourcePieChartProps {
  data: { name: string; value: number }[];
}

/**
 * 车辆来源占比 Echarts 环形图
 * @param {SourcePieChartProps} props - 组件属性
 * @returns {React.ReactElement}
 */
export const SourcePieChart: React.FC<SourcePieChartProps> = ({ data }) => {
  // 2. (Echarts Option)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} 辆 ({d}%)", // (提示框：省份 : 123 辆 (12.3%))
    },
    // (图例)
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: { color: "#B5C5DB" },
      data: data.slice(0, 6).map((item) => item.name), // (Why: 只显示 Top 6 图例防止拥挤)
    },
    series: [
      {
        name: "车辆来源",
        type: "pie",
        radius: ["40%", "60%"], // (环形图)
        center: ["65%", "50%"], // (Why: 向右推，给左侧图例留空间)
        avoidLabelOverlap: false,
        label: {
          show: false, // (不在图上显示标签)
          position: "center",
        },
        emphasis: {
          // (高亮)
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
            formatter: "{b}\n{d}%", // (e.g., 广东 30.5%)
          },
        },
        labelLine: { show: false },
        // (数据绑定) API.md 的 [{name, value}] 格式完美契合
        data: data,
      },
    ],
  };

  // 3. (渲染)
  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

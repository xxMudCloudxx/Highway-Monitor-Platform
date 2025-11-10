/**
 * @file src/components/charts/HourlyFlowChart.tsx
 * @module HourlyFlowChart
 * @description (组件) Echarts 折线图: 24小时流量曲线
 * * 职责:
 * 1. 消费 zustand store 中的 `hourCount` (API 3)。
 * 2. 渲染 Echarts 折线图。
 */

import ReactECharts from "echarts-for-react";
import { useDataScreenStore } from "../../stores/useDataScreenStore";
import * as echarts from "echarts"; // (用于渐变色)

/**
 * 24小时流量曲线 Echarts 折线图
 * @returns {React.ReactElement}
 */
export const HourlyFlowChart = () => {
  // 1. (Zustand) 获取 [接口 3] 数据
  const { hourCount } = useDataScreenStore();

  // 2. (Echarts Option)
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: hourCount.hours, // 对应 API.md "hours"
        axisLabel: { color: "#B5C5DB" },
        axisLine: { lineStyle: { color: "#3B4B6F" } },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "车流量 (辆)",
        nameTextStyle: { color: "#B5C5DB" },
        axisLabel: { color: "#B5C5DB" },
        splitLine: { lineStyle: { color: "#3B4B6F", type: "dashed" } },
      },
    ],
    series: [
      {
        name: "车流量",
        type: "line",
        stack: "Total", // (堆叠)
        smooth: true, // (平滑曲线)
        lineStyle: { width: 2, color: "#4A90E2" },
        showSymbol: false,
        areaStyle: {
          // (渐变色)
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(74, 144, 226, 0.5)" },
            { offset: 1, color: "rgba(74, 144, 226, 0)" },
          ]),
        },
        emphasis: { focus: "series" },
        data: hourCount.data, // 对应 API.md "data"
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

/**
 * @file src/components/charts/KkmcRankingChart.tsx
 * @module KkmcRankingChart
 * @description (组件) Echarts 柱状图: 卡口流量 Top 10
 * * 职责:
 * 1. 接收父组件传递的 `data` (API 2)。
 * 2. 渲染 Echarts 柱状图 (条形图)。
 */

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts"; // (用于渐变色)

/**
 * 卡口流量数据接口
 */
interface KkmcRankingChartProps {
  data: { name: string; value: number }[];
}

/**
 * 卡口流量 Top 10 Echarts 柱状图
 * @param {KkmcRankingChartProps} props - 组件属性
 * @returns {React.ReactElement}
 */
export const KkmcRankingChart: React.FC<KkmcRankingChartProps> = ({ data }) => {
  // 2. (数据转换)
  // Why: Echarts Bar race 需要 x/y 轴数组。
  // (API 返回的是 [{name, value}]，且已排序)
  // (我们反转 .reverse() 是因为 Top 1 在上，数值小的在下)
  const yAxisData = data.map((item) => item.name).reverse();
  const xAxisData = data.map((item) => item.value).reverse();

  // 3. (Echarts Option)
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true, // (自动计算标签空间)
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLabel: { color: "#B5C5DB" },
      splitLine: {
        show: true,
        lineStyle: { color: "#3B4B6F", type: "dashed" },
      },
    },
    yAxis: {
      type: "category",
      data: yAxisData, // (卡口名称)
      axisLabel: {
        color: "#B5C5DB",
        interval: 0, // (确保所有标签都显示)
        fontSize: 10,
      },
      axisLine: { lineStyle: { color: "#3B4B6F" } },
    },
    series: [
      {
        name: "车流量",
        type: "bar",
        data: xAxisData, // (卡口流量)
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            // (渐变色)
            { offset: 0, color: "rgba(74, 144, 226, 0.8)" },
            { offset: 1, color: "rgba(74, 144, 226, 0.3)" },
          ]),
        },
      },
    ],
  };

  // 4. (渲染)
  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

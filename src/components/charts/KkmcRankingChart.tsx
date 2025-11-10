// src/components/charts/KkmcRankingChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useDataScreenStore } from "../../stores/useDataScreenStore";

// 基础 Wrapper (可复用)
const BaseChartWrapper: React.FC<{
  option: any;
  style?: React.CSSProperties;
}> = ({ option }) => {
  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export const KkmcRankingChart = () => {
  // 1. 从 zustand store 中获取 kkmcRank 数据
  const { kkmcRank } = useDataScreenStore();

  // 2. 数据转换 (Echarts 需要 x 轴和 y 轴数据)
  // 我们的 API (接口 2) 返回的是 [{name: '卡口A', value: 9001}, ...]
  // 我们需要把它转换成两个数组，并且(Top 10)是反转的 (数值小的在下面)
  const yAxisData = kkmcRank.map((item) => item.name).reverse();
  const xAxisData = kkmcRank.map((item) => item.value).reverse();

  // 3. 定义 Echarts Option
  // (参考 刘冰峰-前端(数据大屏).pdf.pdf (p. 8-12) 的柱状图风格)
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true, // 自动计算标签空间
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLabel: { color: "#B5C5DB" },
      splitLine: {
        // X轴网格线
        show: true,
        lineStyle: {
          color: "#3B4B6F",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "category",
      data: yAxisData, // 卡口名称
      axisLabel: {
        color: "#B5C5DB",
        interval: 0, // 确保所有标签都显示
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#3B4B6F", // 轴线颜色
        },
      },
    },
    series: [
      {
        name: "车流量",
        type: "bar",
        data: xAxisData, // 卡口流量
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            // 渐变色
            { offset: 0, color: "rgba(74, 144, 226, 0.8)" },
            { offset: 1, color: "rgba(74, 144, 226, 0.3)" },
          ]),
        },
      },
    ],
  };

  return <BaseChartWrapper option={option} />;
};

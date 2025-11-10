// src/components/charts/HourlyFlowChart.tsx
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useDataScreenStore } from "../../store/useDataScreenStore";

// 这是一个可复用的图表Wrapper，你可以添加 loading 等...
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

export const HourlyFlowChart = () => {
  // 1. 从 zustand store 中获取 hourCount 数据
  const { hourCount } = useDataScreenStore();

  // 2. 定义 Echarts Option
  // (我们参考 刘冰峰-前端(数据大屏).pdf.pdf (p. 8-12) 和 react-big-data 的风格)
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
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
        data: hourCount.hours, // 对应 API.md 的 "hours"
        axisLabel: {
          color: "#B5C5DB", // 字体颜色
        },
        axisLine: {
          lineStyle: {
            color: "#3B4B6F", // 轴线颜色
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "车流量 (辆)",
        nameTextStyle: {
          color: "#B5C5DB",
        },
        axisLabel: {
          color: "#B5C5DB",
        },
        splitLine: {
          // Y轴网格线
          lineStyle: {
            color: "#3B4B6F",
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        name: "车流量",
        type: "line",
        stack: "Total", // 堆叠
        smooth: true, // 平滑曲线
        lineStyle: {
          width: 2,
          color: "#4A90E2",
        },
        showSymbol: false,
        areaStyle: {
          // 渐变色
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(74, 144, 226, 0.5)" },
            { offset: 1, color: "rgba(74, 144, 226, 0)" },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: hourCount.data, // 对应 API.md 的 "data"
      },
    ],
  };

  return <BaseChartWrapper option={option} />;
};

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartProps {
  data: { name: string; value: number }[];
}

const VehicleBrandChart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)",
      },
      legend: {
        type: "scroll", // 如果品牌太多，允许滚动
        orient: "vertical",
        right: 10,
        top: 20,
        bottom: 20,
        textStyle: { color: "#fff" },
      },
      series: [
        {
          name: "车辆品牌",
          type: "pie",
          radius: [10, 80],
          center: ["35%", "50%"], // 因为图例在右侧，圆心向左移
          roseType: "area", // 玫瑰图模式
          itemStyle: {
            borderRadius: 4,
          },
          data: data,
        },
      ],
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      chart.dispose();
      resizeObserver.disconnect();
    };
  }, [data]);

  return <div ref={chartRef} className="w-full h-full" />;
};

export default VehicleBrandChart;

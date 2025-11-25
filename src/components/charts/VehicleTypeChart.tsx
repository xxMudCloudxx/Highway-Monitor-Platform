import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartProps {
  data: { name: string; value: number }[];
}

const VehicleTypeChart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        bottom: "0%",
        left: "center",
        textStyle: { color: "#fff" },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: "车辆类型",
          type: "pie",
          radius: ["40%", "70%"], // 环形设置：内圆40%，外圆70%
          center: ["50%", "45%"], //稍微上移一点给Legend留空间
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: "#0f1c3a",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
              color: "#fff",
            },
          },
          labelLine: {
            show: false,
          },
          data: data, // 接收父组件传来的数据
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

export default VehicleTypeChart;

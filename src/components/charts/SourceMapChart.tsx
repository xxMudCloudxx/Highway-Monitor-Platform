// [File: src/components/charts/SourceMapChart.tsx]

/**
 * @file src/components/charts/SourceMapChart.tsx
 * @module SourceMapChart
 * @description (组件) Echarts 地图热力图 (V3.3 - 纯净热力块版)
 * * 职责:
 * 1. 接收父组件传递的 `data` (API 4)。
 * 2. 异步加载（已替换的）新 `xuzhou.json` 并注册。
 * 3. (核心) 遵循 Echarts 官方示例 (香港)，
 * 仅使用 'series.type: "map"' 统一渲染地块、标签和热力颜色。
 * 4. (核心) 移除了所有 'geo' 组件 和 'effectScatter' (涟漪点) 相关代码。
 */

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import axios from "axios"; // (用于获取 xuzhou.json)

/**
 * 车辆来源数据接口
 */
interface SourceMapChartProps {
  data: { name: string; value: number }[];
}

/**
 * 车辆来源 Echarts 地图热力图组件
 * @param {SourceMapChartProps} props - 组件属性
 * @returns {React.ReactElement}
 */
export const SourceMapChart: React.FC<SourceMapChartProps> = ({ data }) => {
  // 2. (State)
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  // 3. (React Hook) 注册地图
  useEffect(() => {
    if (echarts.getMap("xuzhou")) {
      setIsMapRegistered(true);
      return;
    }
    axios
      .get("/map/xuzhou.json") // (确保这里加载的是你新找到的正确文件)
      .then((response) => {
        echarts.registerMap("xuzhou", response.data);
        setIsMapRegistered(true);
        console.log('Echarts Map "xuzhou" 注册成功');
      })
      .catch((error) => {
        console.error('Echarts Map "xuzhou.json" 加载失败:', error);
      });
  }, []);

  // 4. (Echarts Option)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} 辆", // (b: 名称, c: value)
    },
    // (视觉映射)
    visualMap: {
      min: 0,
      max: 20000,
      left: "left",
      top: "bottom",
      text: ["高", "低"],
      calculable: true,
      inRange: {
        // (颜色范围)
        color: ["#0f1c3c", "#1a3a7b", "#2a5abc", "#4a90e2", "#86c5ff"],
      },
      textStyle: {
        color: "#B5C5DB",
      },
    },

    // (V3.3) geo: { ... }  <-- (已删除)

    series: [
      {
        name: "车辆来源",
        type: "map",
        map: "xuzhou",

        // (如果需要 nameMap，取消此行注释)
        // nameMap: xuzhouNameMap,

        roam: false,
        zoom: 1.2,
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",

        itemStyle: {
          areaColor: "#1A3A7B",
          borderColor: "#4A90E2",
        },

        label: {
          show: true,
          color: "#ffffff",
          fontSize: 10,
        },

        emphasis: {
          itemStyle: {
            areaColor: "#FFA500",
          },
          label: {
            show: true,
            color: "#ffffff",
          },
        },
        data: data,
      },
      // [!code focus:start]
      // (V3.3)
      // 'effectScatter' (涟漪点) series 已被完全删除
      // [!code focus:end]
    ],
  };

  // 5. (渲染)
  return isMapRegistered ? (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      地图加载中...
    </div>
  );
};

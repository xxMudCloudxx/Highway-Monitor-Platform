/**
 * @file src/components/charts/SourceMapChart.tsx
 * @module SourceMapChart
 * @description (组件) Echarts 地图热力图
 * * 职责:
 * 1. 消费 zustand store 中的 `mapData` (API 4)。
 * 2. (核心) 异步加载 `public/map/china.json` 并注册 Echarts 地图。
 */

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useDataScreenStore } from "../../stores/useDataScreenStore";
import * as echarts from "echarts";
import axios from "axios"; // (用于获取 china.json)

/**
 * 车辆来源 Echarts 地图热力图组件
 * @returns {React.ReactElement}
 */
export const SourceMapChart = () => {
  // 1. (Zustand) 获取 [接口 4] 的数据
  const { mapData } = useDataScreenStore();

  // 2. (State)
  /** 状态：用于跟踪地图 JSON 是否已加载并注册 */
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  // 3. (React Hook)
  /**
   * 异步加载和注册地图 GeoJSON
   * * Why: Echarts 必须先 "registerMap" 才能使用 "geo" 组件。
   */
  useEffect(() => {
    // (防止重复注册)
    if (echarts.getMap("china")) {
      setIsMapRegistered(true);
      return;
    }

    // (从 public/ 文件夹获取)
    axios
      .get("/map/china.json")
      .then((response) => {
        echarts.registerMap("china", response.data);
        setIsMapRegistered(true);
        console.log('Echarts Map "china" 注册成功');
      })
      .catch((error) => {
        console.error('Echarts Map "china.json" 加载失败:', error);
      });
  }, []); // 依赖项为空，仅运行一次

  // 4. (Echarts Option)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} 辆", // (b: 名称, c: value)
    },
    // (视觉映射)
    visualMap: {
      min: 0,
      max: 20000, // (Mock)
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
    // (核心) 地理坐标系
    geo: {
      map: "china", // 必须和 registerMap 的名字一致
      roam: false, // (禁止缩放)
      zoom: 1.2,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        areaColor: "#1A3A7B",
        borderColor: "#4A90E2",
      },
      emphasis: {
        itemStyle: {
          areaColor: "#FFA500", // (高亮时颜色)
        },
      },
    },
    series: [
      {
        name: "车辆来源",
        type: "map", // (类型为地图)
        geoIndex: 0, // (关联到上面的 geo)
        data: mapData, // (绑定 zustand store 数据)
      },
    ],
  };

  // 5. (渲染)
  // (必须等待 map 注册成功后才渲染，否则 Echarts 会报错)
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

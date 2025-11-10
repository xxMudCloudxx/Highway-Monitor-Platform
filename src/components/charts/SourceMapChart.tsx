// src/components/charts/SourceMapChart.tsx
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useDataScreenStore } from "../../stores/useDataScreenStore";
import * as echarts from "echarts";
import axios from "axios"; // 我们用 axios 来获取 public 文件夹下的 json

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

export const SourceMapChart = () => {
  // 1. 从 zustand store 中获取 mapData
  // (API.md 接口 4: [{ name: "广东", value: 15000 }, ...])
  const { mapData } = useDataScreenStore();

  // 2. 状态：用于跟踪地图 JSON 是否已加载并注册
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  // 3. 异步加载和注册地图
  useEffect(() => {
    // 防止重复注册
    if (echarts.getMap("china")) {
      setIsMapRegistered(true);
      return;
    }

    // 从 public/map/china.json 获取地图数据
    axios
      .get("/map/china.json")
      .then((response) => {
        // (参考 react-big-data/Map.js 的做法)
        echarts.registerMap("china", response.data);
        setIsMapRegistered(true);
        console.log('Echarts Map "china" 注册成功');
      })
      .catch((error) => {
        console.error('Echarts Map "china.json" 加载失败:', error);
      });
  }, []); // 仅在组件挂载时运行一次

  // 4. 定义 Echarts Option
  // (我们大量参考 react-big-data/Map.js 的配置)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} 辆", // 提示框格式：省份: 12345 辆
    },
    // (核心) 视觉映射组件，用于显示热力图
    visualMap: {
      min: 0,
      max: 20000, // 假设最大值 (可以动态设置)
      left: "left",
      top: "bottom",
      text: ["高", "低"],
      calculable: true,
      inRange: {
        // 定义颜色范围
        color: ["#0f1c3c", "#1a3a7b", "#2a5abc", "#4a90e2", "#86c5ff"],
      },
      textStyle: {
        color: "#B5C5DB",
      },
    },
    // (核心) 地理坐标系
    geo: {
      map: "china", // 必须和 registerMap 的名字一致
      roam: false, // 禁止缩放
      zoom: 1.2,
      layoutCenter: ["50%", "50%"], // 地图居中
      layoutSize: "100%",
      itemStyle: {
        areaColor: "#1A3A7B", // 地图区域颜色
        borderColor: "#4A90E2", // 边框颜色
      },
      emphasis: {
        itemStyle: {
          areaColor: "#FFA500", // 高亮时颜色
        },
      },
    },
    series: [
      {
        name: "车辆来源",
        type: "map", // 类型为地图
        geoIndex: 0, // 关联到上面的 geo 组件
        data: mapData, // 绑定我们 zustand store 的数据
      },
      // (可选) 添加“地图炮”的散点效果 (参考 react-big-data)
      // (这个需要省份的经纬度，我们暂时先只做热力图)
    ],
  };

  // 5. 只有当 china.json 注册成功后才渲染图表
  return isMapRegistered ? (
    <BaseChartWrapper option={option} />
  ) : (
    <div>地图加载中...</div>
  );
};

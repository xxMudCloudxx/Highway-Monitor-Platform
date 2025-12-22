// [File: src/components/charts/SourceMapChart.tsx]

/**
 * @file src/components/charts/SourceMapChart.tsx
 * @description (组件) Echarts 综合监控图 (V8.2 - 双色阶独立配色版)
 * * 核心变更:
 * 1. 锁定地图: roam: false，禁止移动缩放。
 * 2. 双 VisualMap: 地图用深蓝，散点用“蓝黄红”高亮，彻底解决点不明显的问题。
 */

import { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import axios from "axios";

// 1. 卡口坐标字典 (已校准)
const stationCoordinates: Record<string, [number, number]> = {
  "G518-丰县-马楼站": [116.5365, 34.7633],
  "G237-丰县-荣庄": [116.4988, 34.6512],
  "鹿梁路-丰县-梁寨站": [116.7135, 34.6163],
  "S253-沛县-苏鲁界": [116.9358, 34.8022],
  "G3-京台高速-苏鲁界": [117.2223, 34.6429],
  "G104-铜山-苏鲁界": [117.1321, 34.5117],
  "G310-铜山-苏皖界": [116.9487, 34.3084],
  "G311-铜山-苏皖界": [117.0495, 34.1909],
  "G206-铜山-苏皖界": [117.2606, 34.0886],
  "S250-邳州-苏鲁界": [117.937, 34.6384],
  "S251-邳州-苏鲁界": [118.121, 34.5523],
  "G310连云港-天水K152": [117.9702, 34.326],
  "S325-睢宁-西卡口": [117.7682, 33.9571],
  "S324-睢宁-桑庄": [117.9498, 33.9707],
  "G104-睢宁-苏皖界": [117.8451, 33.8567],
  "S252-睢宁-苏皖界": [118.0657, 33.8758],
  "S505-新沂-高速西": [118.1753, 34.3909],
  "S323-新沂-瓦窑站": [118.3448, 34.3598],
  "G235-新沂-交界": [118.4819, 34.3796],
  "S323-新沂-阿湖卡口": [118.2686, 34.2121],
};

interface SourceMapChartProps {
  data: {
    districts: { name: string; value: number }[];
    stations: { name: string; value: number }[];
  };
}

export const SourceMapChart: React.FC<SourceMapChartProps> = ({ data }) => {
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  const districtsData = data?.districts || [];
  const stationsDataRaw = data?.stations || [];

  // 2. 散点数据处理
  const scatterData = useMemo(() => {
    const res: any[] = [];
    stationsDataRaw.forEach((item) => {
      const geoCoord = stationCoordinates[item.name];
      if (geoCoord) {
        res.push({
          name: item.name,
          value: [...geoCoord, item.value],
        });
      }
    });
    return res;
  }, [stationsDataRaw]);

  // 3. 注册地图
  useEffect(() => {
    axios.get("/map/xuzhou.json").then((response) => {
      echarts.registerMap("xuzhou", response.data);
      setIsMapRegistered(true);
    });
  }, []);

  // 4. Echarts 配置
  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,0.8)",
      borderColor: "#0f375f",
      textStyle: { color: "#fff" },
      formatter: function (params: any) {
        if (params.seriesType === "effectScatter") {
          return `<div style="text-align:left;">
              <b style="color:#fff;">${params.name}</b><br/>
              <span style="color:#aaa;">卡口流量:</span> <span style="color:#FFD700;font-weight:bold">${params.value[2]}</span>
            </div>`;
        } else {
          return `<div style="text-align:left;">
              <b style="color:#fff;">${params.name}</b><br/>
              <span style="color:#aaa;">区域总流量:</span> <span style="color:#86c5ff;font-weight:bold">${
                params.value || 0
              }</span>
            </div>`;
        }
      },
    },

    // 🎨 核心修改: 使用数组定义两个 visualMap，实现颜色分离
    visualMap: [
      // 1. 底图配色 (经典蓝紫)
      {
        type: "continuous",
        seriesIndex: 0, // 仅控制 series[0] (行政区地图)
        min: 0,
        max: 3000,
        left: "20",
        bottom: "20",
        text: ["区域高", "区域低"],
        inRange: {
          color: ["#0f1c3c", "#1a3a7b", "#2a5abc", "#4a90e2", "#86c5ff"],
        },
        textStyle: { color: "#B5C5DB" },
      },
      // 2. 散点配色 (蓝-橙-红) - 让点非常明显
      {
        type: "continuous",
        seriesIndex: 1, // 仅控制 series[1] (卡口散点)
        min: 0,
        max: 1200, // 卡口流量通常比区域小，上限设低一点
        right: "20", // 放在右下角，避免重叠
        bottom: "20",
        text: ["热门", "冷淡"],
        inRange: {
          // 颜色顺序: 低 -> 高 (蓝 -> 黄 -> 红)
          color: ["#8eecf7", "#f1c064", "#ff0c0c"],
          // 同时也控制点的大小，流量越大点越大
          symbolSize: [8, 15],
        },
        textStyle: { color: "#fff" },
      },
    ],

    // Geo 隐形底座 (定位用)
    geo: {
      map: "xuzhou",
      roam: false, // 🚫 锁定地图，禁止移动/缩放
      zoom: 1.2,
      label: { show: false },
      itemStyle: { opacity: 0 },
    },

    series: [
      // Layer 1: 行政区热力图
      {
        name: "区域流量",
        type: "map",
        map: "xuzhou",
        roam: false, // 🚫 锁定地图，禁止移动/缩放
        zoom: 1.2,
        // 绑定到第一个 visualMap (索引0)
        // Echarts 默认逻辑，如果不指定，visualMap会自动匹配。
        // 但为了保险，我们可以依赖 seriesIndex 的匹配逻辑。

        label: {
          show: true,
          color: "#ffffff",
          fontSize: 10,
        },
        itemStyle: {
          areaColor: "#1A3A7B",
          borderColor: "#4A90E2",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: "#FFA500",
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          label: { color: "#fff" },
        },
        data: districtsData,
        zlevel: 0,
      },

      // Layer 2: 卡口散点图
      {
        name: "卡口流量",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: scatterData,

        // 注意：symbolSize 现在由 visualMap[1] 接管控制，
        // 这里可以不写，或者写一个回调作为 fallback

        rippleEffect: {
          brushType: "stroke",
          scale: 3,
        },

        itemStyle: {
          // 删除了 color: '#fff'，让 visualMap[1] 的红黄蓝生效
          shadowBlur: 10,
          shadowColor: "#333",
        },

        label: { show: false },
        zlevel: 1,
      },
    ],
  };

  return isMapRegistered ? (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      地图加载中...
    </div>
  );
};

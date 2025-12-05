// [File: src/components/charts/SourceMapChart.tsx]

/**
 * @file src/components/charts/SourceMapChart.tsx
 * @description (组件) Echarts 卡口热力分布图 (V5.0 - 完美匹配后端中文名版)
 */

import { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import axios from "axios";

// ----------------------------------------------------------------------
// 1. 核心映射表: 将后端返回的中文名称映射到徐州地图经纬度
// * 这里的 Key 必须与 console.log 打印出的 name 完全一致
// ----------------------------------------------------------------------
const stationCoordinates: Record<string, [number, number]> = {
  // --- 丰县 (西北) ---
  "G518-丰县-马楼站": [116.5365, 34.7633], // 西北角
  "G237-丰县-荣庄": [116.4988, 34.6512], // 西部边界
  "鹿梁路-丰县-梁寨站": [116.7135, 34.6163], // 东南部

  // --- 沛县 (北部) ---
  "S253-沛县-苏鲁界": [116.9358, 34.8022], // 北部边界

  // --- 铜山区 (环绕市区，北部、西部、南部) ---
  "G3-京台高速-苏鲁界": [117.2223, 34.6429], // 北部 (高速入口附近)
  "G104-铜山-苏鲁界": [117.1321, 34.5117], // 西北部边界
  "G310-铜山-苏皖界": [116.9487, 34.3084], // 西部边界
  "G311-铜山-苏皖界": [117.0495, 34.1909], // 西南部边界
  "G206-铜山-苏皖界": [117.2606, 34.0886], // 南部边界

  // --- 邳州市 (东部/东北部) ---
  "S250-邳州-苏鲁界": [117.937, 34.6384], // 北部边界
  "S251-邳州-苏鲁界": [118.121, 34.5523], // 东北边界
  "G310连云港-天水K152": [117.9702, 34.326], // 中部

  // --- 睢宁县 (东南部) ---
  "S325-睢宁-西卡口": [117.7682, 33.9571], // 西部边界
  "S324-睢宁-桑庄": [117.9498, 33.9707], // 中部
  "G104-睢宁-苏皖界": [117.8451, 33.8567], // 南部边界
  "S252-睢宁-苏皖界": [118.0657, 33.8758], // 东南边界

  // --- 新沂市 (最东部) ---
  "S505-新沂-高速西": [118.1753, 34.3909], // 西部
  "S323-新沂-瓦窑站": [118.3448, 34.3598], // 中部
  "G235-新沂-交界": [118.4819, 34.3796], // 东部边界
  "S323-新沂-阿湖卡口": [118.2686, 34.2121], // 南部边界
};

interface SourceMapChartProps {
  data: { name: string; value: number }[];
}

export const SourceMapChart: React.FC<SourceMapChartProps> = ({ data }) => {
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  // 2. 数据转换: 匹配坐标
  const convertData = (backendData: { name: string; value: number }[]) => {
    const res: any[] = [];
    if (!backendData) return res;

    // console.log("地图收到数据:", backendData);

    backendData.forEach((item) => {
      // 这里的 item.name 就是 "S250-邳州-苏鲁界"
      const geoCoord = stationCoordinates[item.name];

      if (geoCoord) {
        res.push({
          name: item.name,
          // 数组格式: [经度, 纬度, 流量值]
          value: [...geoCoord, item.value],
        });
      } else {
        // 如果后端加了新点，这里会警告，方便后续补充坐标
        console.warn(`⚠️ 坐标字典缺失: [${item.name}]`);
      }
    });
    return res;
  };

  const mapData = useMemo(() => convertData(data), [data]);

  // 3. 注册地图
  useEffect(() => {
    if (echarts.getMap("xuzhou")) {
      setIsMapRegistered(true);
      return;
    }
    axios
      .get("/map/xuzhou.json")
      .then((response) => {
        echarts.registerMap("xuzhou", response.data);
        setIsMapRegistered(true);
      })
      .catch((error) => {
        console.error("Map Load Failed:", error);
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
          const val = params.value[2]; // 取流量值
          return `
            <div style="text-align:left; padding:5px;">
              <b style="color:#fff; font-size:14px;">${params.name}</b><br/>
              <span style="color:#aaa;">实时流量:</span> 
              <span style="color:#FFD700; font-weight:bold; font-size:16px; margin-left:5px;">${val}</span>
            </div>
          `;
        }
        return params.name;
      },
    },

    // 视觉映射: 9万多是最大值，所以 max 设 100000 比较合适
    visualMap: {
      min: 0,
      max: 100000,
      dimension: 2, // 指定使用 data 的第 3 列 (value) 来计算颜色
      left: "20",
      bottom: "20",
      text: ["高流量", "低流量"],
      calculable: true,
      inRange: {
        color: ["#50a3ba", "#eac736", "#d94e5d"], // 蓝 -> 黄 -> 红
        symbolSize: [8, 20], // 流量越大，圆点越大
      },
      textStyle: { color: "#fff" },
    },

    // 底部地图层 (深蓝背景)
    geo: {
      map: "xuzhou",
      roam: true,
      zoom: 1.2,
      zlevel: 0,
      label: { show: true }, // 不显示行政区名字，太乱
      itemStyle: {
        areaColor: "#0F1C3C",
        borderColor: "#4A90E2",
        borderWidth: 1,
        shadowColor: "rgba(0, 54, 255, 0.5)",
        shadowBlur: 10,
      },
      emphasis: {
        itemStyle: { areaColor: "#1A3A7B" },
      },
    },

    // 数据散点层
    series: [
      {
        name: "卡口流量",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: mapData,
        rippleEffect: {
          brushType: "stroke",
          scale: 3,
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "#333",
        },
        label: { show: false }, // 名字太长，平时隐藏，鼠标放上去显示
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

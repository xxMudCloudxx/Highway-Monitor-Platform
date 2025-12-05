/**
 * @file src/stores/useDataScreenStore.ts
 * @module useDataScreenStore
 * @description (Zustand Store) 数据大屏的全局状态管理
 * * 职责:
 * 1. 存储所有大屏图表所需的数据 (API 2-8)。
 * 2. 暴露一个统一的 `fetchAllData` 异步 action。
 * 3. 此 store 的 action 由 DataScreen.tsx 的 30s 定时器 驱动。
 */

import { create } from "zustand";
import axios from "axios";
import { formatKkmc } from "../utils/dict";

// --- 1. (类型定义) 基于 API.md v1.3 ---

/**
 * @interface HourCountData
 * @description [接口 3] /api/stats/hour_count 的 data 格式
 */
interface HourCountData {
  hours: string[];
  data: number[];
}

/**
 * @interface ChartItem
 * @description 通用图表数据项 {name, value}，用于 排行榜、地图、饼图
 */
export interface ChartItem {
  name: string;
  value: number;
}

/**
 * @interface PredictionData
 * @description [接口 8] /api/predict/flow 的 data 格式 (来自同学C)
 */
interface PredictionData {
  kkmc: string;
  hour: number;
  predicted_flow: number;
}

// --- 2. (State 定义) ---

/**
 * @interface DataScreenState
 * @description Store 的状态 (State) 和 动作 (Actions)
 */
interface DataScreenState {
  // --- State ---

  /** [接口 3] 24小时流量曲线 */
  hourCount: HourCountData;

  /** [接口 2] 卡口流量 Top 10 (柱状图) */
  kkmcRank: ChartItem[];

  /** [接口 4] 行政区划分布 (地图/饼图) - 原“来源地图” */
  mapData: ChartItem[];

  /** [接口 5] 车辆类型占比 (左侧环形图) - v1.2新增 */
  vehicleTypeData: ChartItem[];

  /** [接口 6] 车辆品牌占比 (右侧玫瑰图) - v1.2新增 */
  vehicleBrandData: ChartItem[];

  /** [接口 7] 实时套牌车告警 (滚动列表) */
  realtimeWarnings: string[];

  /** [接口 8] 未来流量预测 (数字卡片) */
  prediction: PredictionData | null;

  // --- Actions ---

  /**
   * 异步 Action: 从所有 Mock API 拉取数据并更新状态。
   * (此操作会在 DataScreen.tsx 中被定时器 周期性调用)
   * @async
   * @returns {Promise<void>}
   */
  fetchAllData: () => Promise<void>;
}

// --- 3. (创建 Store) ---

export const useDataScreenStore = create<DataScreenState>((set) => ({
  // --- 默认值 (Default State) ---
  hourCount: { hours: [], data: [] },
  kkmcRank: [],
  mapData: [],
  vehicleTypeData: [], // 新增
  vehicleBrandData: [], // 新增
  realtimeWarnings: [],
  prediction: null,

  // --- 动作实现 (Actions Implementation) ---

  fetchAllData: async () => {
    try {
      // 获取当前小时用于预测接口
      const currentHour = new Date().getHours();

      // (并行请求所有大屏 API，提高加载速度)
      const [
        hourRes, // 接口 3
        kkmcRes, // 接口 2
        mapRes, // 接口 4
        typeRes, // 接口 5
        brandRes, // 接口 6
        warningRes, // 接口 7
        predictRes, // 接口 8
      ] = await Promise.all([
        axios.get("/api/stats/hour_count"),
        axios.get("/api/stats/kkmc_count"),
        axios.get("/api/stats/map_data"), // 修正为行政区划数据
        axios.get("/api/stats/vehicle_type"), // 新增请求
        axios.get("/api/stats/vehicle_brand"), // 新增请求
        axios.get("/api/warnings/realtime"),
        axios.get(`/api/predict/flow?hour=${currentHour}`),
      ]);

      // 处理卡口排行数据：将 Code 转换为中文
      const rawKkmcList = kkmcRes.data.data || [];
      const formattedKkmcList = rawKkmcList.map((item: any) => ({
        ...item,
        name: formatKkmc(item.name), // 使用字典进行翻译
      }));

      // (批量更新状态，减少 React 渲染次数)
      set({
        hourCount: hourRes.data.data,
        kkmcRank: formattedKkmcList,
        mapData: mapRes.data.data,
        vehicleTypeData: typeRes.data.data, // 注入新数据
        vehicleBrandData: brandRes.data.data, // 注入新数据
        realtimeWarnings: warningRes.data.data,
        prediction: predictRes.data.data,
      });

      console.log("Mock 数据已全部刷新 (Zustand Store)");
    } catch (error) {
      // 阶段三联调时，这里可以帮我们快速定位是哪个接口挂了
      console.error("Mock 数据请求失败 (部分或全部):", error);
    }
  },
}));

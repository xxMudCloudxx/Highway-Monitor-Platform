/**
 * @file src/stores/useDataScreenStore.ts
 * @module useDataScreenStore
 * @description (Zustand Store) 数据大屏的全局状态管理
 * * 职责:
 * 1. 存储所有大屏图表所需的数据 (API 2-6)。
 * 2. 暴露一个统一的 `fetchAllData` 异步 action。
 * 3. 此 store 的 action 由 DataScreen.tsx 的 30s 定时器 驱动。
 */

import { create } from "zustand";
import axios from "axios";

// --- 1. (类型定义) 基于 API.md ---

/**
 * @interface HourCountData
 * @description [接口 3] /api/stats/hour_count 的 data 格式
 */
interface HourCountData {
  hours: string[];
  data: number[];
}

/**
 * @interface KkmcRankData
 * @description [接口 2] /api/stats/kkmc_count 的 data 格式 (Echarts pie/bar data)
 */
interface KkmcRankData {
  name: string;
  value: number;
}

/**
 * @interface MapData
 * @description [接口 4] /api/stats/map_data 的 data 格式 (Echarts map/pie data)
 */
interface MapData {
  name: string;
  value: number;
}

/**
 * @interface PredictionData
 * @description [接口 6] /api/predict/flow 的 data 格式 (来自同学C)
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
  /** 24小时流量曲线 (API 3) */
  hourCount: HourCountData;
  /** 卡口流量 Top 10 (API 2) */
  kkmcRank: KkmcRankData[];
  /** 车辆来源地图/饼图 (API 4) */
  mapData: MapData[];
  /** 实时套牌车告警 (API 5) */
  realtimeWarnings: string[];
  /** 未来流量预测 (API 6) */
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
  realtimeWarnings: [],
  prediction: null,

  // --- 动作实现 (Actions Implementation) ---

  fetchAllData: async () => {
    try {
      // (如 注释规范.pdf 所述，清晰的命名 > 繁琐的注释)
      // (我们用 Promise.all 并行请求所有大屏 API)
      const currentHour = new Date().getHours();

      const [
        hourRes, // 接口 3
        kkmcRes, // 接口 2
        mapRes, // 接口 4
        warningRes, // 接口 5
        predictRes, // 接口 6
      ] = await Promise.all([
        axios.get("/api/stats/hour_count"),
        axios.get("/api/stats/kkmc_count"),
        axios.get("/api/stats/map_data"),
        axios.get("/api/warnings/realtime"),
        // [接口 6] 需要动态参数
        axios.get(`/api/predict/flow?hour=${currentHour}`),
      ]);

      // (使用 set 更新状态)
      set({
        hourCount: hourRes.data.data,
        kkmcRank: kkmcRes.data.data,
        mapData: mapRes.data.data,
        realtimeWarnings: warningRes.data.data,
        prediction: predictRes.data.data,
      });

      console.log("Mock 数据已全部刷新 (Zustand Store)");
    } catch (error) {
      // (错误处理) 在联调阶段，这里会非常重要
      console.error("Mock 数据请求失败:", error);
    }
  },
}));

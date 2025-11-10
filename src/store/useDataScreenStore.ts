// src/stores/useDataScreenStore.ts
import { create } from "zustand";
import axios from "axios";

// 1. 定义 API 响应的类型 (基于 API.md)
interface HourCountData {
  hours: string[];
  data: number[];
}

interface KkmcRankData {
  name: string;
  value: number;
}

interface MapData {
  name: string;
  value: number;
}

// 2. 定义 Store 的 State (状态) 和 Actions (动作)
interface DataScreenState {
  hourCount: HourCountData;
  kkmcRank: KkmcRankData[];
  mapData: MapData[];
  realtimeWarnings: string[];

  // 我们的核心动作：一个函数获取所有数据
  fetchAllData: () => Promise<void>;
}

// 3. 创建 Store
export const useDataScreenStore = create<DataScreenState>((set) => ({
  // 默认值
  hourCount: { hours: [], data: [] },
  kkmcRank: [],
  mapData: [],
  realtimeWarnings: [],

  // 异步 Action
  fetchAllData: async () => {
    try {
      // (我们同时并行请求所有接口)
      const [
        hourRes, // 接口 3
        kkmcRes, // 接口 2
        mapRes, // 接口 4
        warningRes, // 接口 5
      ] = await Promise.all([
        axios.get("/api/stats/hour_count"),
        axios.get("/api/stats/kkmc_count"),
        axios.get("/api/stats/map_data"),
        axios.get("/api/warnings/realtime"),
      ]);

      // (使用 set 更新状态)
      set({
        hourCount: hourRes.data.data,
        kkmcRank: kkmcRes.data.data,
        mapData: mapRes.data.data,
        realtimeWarnings: warningRes.data.data,
      });

      console.log("Mock 数据已全部刷新 (Zustand Store)");
    } catch (error) {
      console.error("Mock 数据请求失败:", error);
    }
  },
}));

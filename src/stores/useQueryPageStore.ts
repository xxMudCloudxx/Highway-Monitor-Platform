/**
 * @file src/stores/useQueryPageStore.ts
 * @module useQueryPageStore
 * @description (Zustand Store) 交互式查询页面的全局状态管理
 *
 * 职责:
 * 1. 存储交互式查询的表单参数 (params)。
 * 2. 存储 [接口 1] 返回的表格数据 (data) 和总数 (total)。
 * 3. 存储加载状态 (loading)。
 * 4. 暴露 `setParams` (设置参数) 和 `fetchData` (执行查询) 两个 actions。
 */

import { create } from "zustand";
import axios from "axios";

// --- 1. (类型定义) 基于 API.md (接口 1) ---

/**
 * @interface QueryParams
 * @description [接口 1] (POST /api/query) 的 Request Body 格式
 */
interface QueryParams {
  kkmc?: string | null;
  hphm?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  vehicleType?: string | null; // 车辆类型
  province?: string | null; // 车牌省份
  fuelType?: string | null; // 车辆种类
  page: number;
  limit: number;
}

/**
 * @interface TrafficRecord
 * @description [接口 1] 返回数据中 `records` 数组的单条记录格式
 * (字段基于 交通流量数据字段说明.png)
 */
interface TrafficRecord {
  GCXH: number;
  KKMC: string;
  HPHM: string;
  GCSJ: string;
  CLLX: string;
  CPFSF: string;
}

/**
 * @interface QueryResponseData
 * @description [接口 1] 响应体中 `data` 字段的格式
 */
interface QueryResponseData {
  total: number;
  records: TrafficRecord[];
}

// --- 2. (State 定义) ---

/**
 * @interface QueryPageState
 * @description Store 的状态 (State) 和 动作 (Actions)
 */
interface QueryPageState {
  // --- State ---
  /** (核心) 搜索表单和分页器 的受控状态 */
  params: QueryParams;
  /** (核心) [接口 1] 返回的查询结果 */
  data: QueryResponseData;
  /** (核心) 是否正在加载数据 (用于 Table 和 Button 的 loading 状态) */
  loading: boolean;

  // --- Actions ---

  /**
   * (Action) 设置/合并查询参数
   * (用于 Antd Form 和 Pagination 的受控)
   *
   * @param {Partial<QueryParams>} newParams - 新的参数对象 (部分)
   * @returns {void}
   */
  setParams: (newParams: Partial<QueryParams>) => void;

  /**
   * (Action) 异步 Action: 执行 [接口 1] (POST /api/query)
   * * 它会自动读取 store 中最新的 `params` 作为 Request Body。
   *
   * @async
   * @returns {Promise<void>}
   */
  fetchData: () => Promise<void>;
}

// --- 3. (创建 Store) ---

export const useQueryPageStore = create<QueryPageState>((set, get) => ({
  // --- 默认值 (Default State) ---
  params: {
    page: 1,
    limit: 15, // (Antd 默认分页)
    kkmc: null,
    hphm: null,
    startTime: null,
    endTime: null,
    vehicleType: null,
    province: null,
    fuelType: null,
  },
  data: {
    total: 0,
    records: [],
  },
  loading: false,

  // --- 动作实现 (Actions Implementation) ---

  setParams: (newParams) => {
    set((state) => ({
      params: { ...state.params, ...newParams },
    }));
  },

  fetchData: async () => {
    // 1. (开始加载)
    set({ loading: true });

    // 2. (获取当前最新的 params)
    // (使用 get() 来确保获取最新状态)
    const currentParams = get().params;

    try {
      // 3. (Mock / 联调) 调用 [接口 1]
      const response = await axios.post("/api/query", currentParams);

      if (response.data.code === 200) {
        // 4. (更新 store)
        set({ data: response.data.data });
        console.log("Mock [交互式查询] 成功:", response.data.data);
      } else {
        // (后端返回 code !== 200 的情况)
        console.error("API 返回错误:", response.data.msg);
        set({ data: { total: 0, records: [] } }); // (出错时清空)
      }
    } catch (error) {
      // (网络异常 / 500 / CORS 错误)
      console.error("Mock 请求失败:", error);
      set({ data: { total: 0, records: [] } }); // (异常时清空)
    } finally {
      // 5. (停止加载)
      set({ loading: false });
    }
  },
}));

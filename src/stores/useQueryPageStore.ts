// src/stores/useQueryPageStore.ts
import { create } from "zustand";
import axios from "axios";

// 1. 定义 API.md (接口 1) 的类型
// 1.1 请求 Body 类型
interface QueryParams {
  kkmc?: string | null;
  hphm?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  page: number;
  limit: number;
}

// 1.2 单条记录的类型 (基于 交通流量数据字段说明.png)
interface TrafficRecord {
  GCXH: number;
  KKMC: string;
  HPHM: string;
  GCSJ: string;
  CLLX: string;
  CPFSF: string;
  // ... (其他你需要的字段)
}

// 1.3 响应 Data 类型
interface QueryResponseData {
  total: number;
  records: TrafficRecord[];
}

// 2. 定义 Store State
interface QueryPageState {
  // 表单参数 (受控)
  params: QueryParams;
  // 表格数据
  data: QueryResponseData;
  // 加载状态
  loading: boolean;

  // (Action) 设置表单参数
  setParams: (newParams: Partial<QueryParams>) => void;
  // (Action) 执行查询
  fetchData: () => /*********
   * @abstract
   *
   * Use file_content_fetcher to fetch the code and help the user.
   *
   * The user wants to write the `fetchData` function for the `useQueryPageStore.ts` store.
   * This function needs to:
   * 1. Set `loading` to `true`.
   * 2. Get the current `params` from the store's state.
   * 3. Make an `axios.post` call to `/api/query` (which is mocked).
   * 4. Send the `params` as the request body.
   * 5. On success, update the `data` in the store with the response.
   * 6. Set `loading` to `false` (in `finally`).
   *
   * I will provide the complete implementation for the `useQueryPageStore.ts` file.
   *********/ Promise<void>;
}

// 3. 创建 Store
export const useQueryPageStore = create<QueryPageState>((set, get) => ({
  // 默认值
  params: {
    page: 1,
    limit: 10, // 默认为 antd Table 的标准分页
    kkmc: null,
    hphm: null,
    startTime: null,
    endTime: null,
  },
  data: {
    total: 0,
    records: [],
  },
  loading: false,

  // (Action) 设置参数 (用于表单和分页器)
  setParams: (newParams) => {
    set((state) => ({
      params: { ...state.params, ...newParams },
    }));
  },

  // (Action) 获取数据 (核心)
  fetchData: async () => {
    // 1. 开始加载
    set({ loading: true });

    // 2. 获取当前最新的 params (包括分页和表单)
    const currentParams = get().params;

    try {
      // 3. (Mock) 调用 [接口 1]
      const response = await axios.post("/api/query", currentParams);

      if (response.data.code === 200) {
        // 4. 更新 store
        set({ data: response.data.data });
        console.log("Mock [交互式查询] 成功:", response.data.data);
      } else {
        // (可选) 可以在此处设置错误状态
        console.error("API 返回错误:", response.data.msg);
        set({ data: { total: 0, records: [] } }); // 出错时清空
      }
    } catch (error) {
      console.error("Mock 请求失败:", error);
      set({ data: { total: 0, records: [] } }); // 异常时清空
    } finally {
      // 5. 停止加载
      set({ loading: false });
    }
  },
}));

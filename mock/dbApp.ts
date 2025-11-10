// [File: mock/dbApp.ts]

import { MockMethod } from "vite-plugin-mock";
import Mock from "mockjs"; // 引入 mockjs

// 1. 模拟卡口名称 (基于 12-01.csv 简化)
const kkmcList = [
  "邳州S250-苏鲁界卡口",
  "丰县梁寨检查站",
  "邳州S251-苏鲁界卡口",
  "新沂S505-高速西出口",
  "睢宁G104-苏皖界卡口",
  "铜山G310-苏皖界卡口",
  "沛县G311-苏鲁界卡口",
  "贾汪G206-苏鲁界卡口",
  "云龙区G104-东口",
  "泉山区G30-徐州西",
];

// 2. 模拟徐州区县 (用于地图和查询)
const districts = [
  "丰县",
  "沛县",
  "铜山区",
  "睢宁县",
  "邳州市",
  "新沂市",
  "鼓楼区",
  "云龙区",
  "贾汪区",
  "泉山区",
];

export default [
  {
    // [接口 1] 交互式查询 (POST)
    url: "/api/query",
    method: "post",
    response: ({ body }: { body?: any }) => {
      const { page = 1, limit = 10 } = body || {};
      const total = 1024; // 假设总数

      const records = Mock.mock({
        [`list|${limit}`]: [
          {
            "GCXH|+1": (page - 1) * limit + 1, // 序号
            KKMC: "@pick(kkmcList)", // 卡口名称 (徐州)
            HPHM: `苏C·@string("upper", 5)`, // 车牌号 (徐州)
            CLLX: `K@integer(1, 4)@integer(1, 4)`, // 车辆类型
            CPFSF: "@pick(districts)", // 车牌附省份 (改为徐州区县)
            GCSJ: `@datetime("2025-11-01 HH:mm:ss")`, // 过车时间
            XZQHMC: "徐州市", // 固定为徐州市
          },
        ],
      }).list;

      return {
        code: 200,
        msg: "success",
        data: {
          total: total,
          records: records,
        },
      };
    },
  },
  {
    // [接口 2] 大屏：卡口流量 Top 10 (GET)
    url: "/api/stats/kkmc_count",
    method: "get",
    response: () => {
      const data = kkmcList // (使用徐州卡口)
        .map((name) => ({
          name: name,
          value: Mock.Random.integer(1000, 10000),
        }))
        .sort((a, b) => b.value - a.value); // 后端负责排序

      return {
        code: 200,
        msg: "success",
        data: data,
      };
    },
  },
  {
    // [接口 3] 大屏：24小时流量曲线 (GET)
    // (此接口通用，无需修改)
    url: "/api/stats/hour_count",
    method: "get",
    response: {
      code: 200,
      msg: "success",
      data: {
        hours: Array.from(
          { length: 24 },
          (_, i) => `${String(i).padStart(2, "0")}:00`
        ),
        data: Array.from({ length: 24 }, () => Mock.Random.integer(100, 2000)),
      },
    },
  },
  {
    // [接口 4] 大屏：车辆来源地图 (GET)
    // (注意 URL 是 /api/stats/map_data)
    url: "/api/stats/map_data",
    method: "get",
    response: () => {
      const data = districts // (使用徐州区县)
        .map((name) => ({
          name: name,
          value: Mock.Random.integer(500, 20000),
        }))
        .sort((a, b) => b.value - a.value);

      return {
        code: 200,
        msg: "success",
        data: data,
      };
    },
  },
] as MockMethod[];

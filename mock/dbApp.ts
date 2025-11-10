// mock/dbApp.ts
import { MockMethod } from "vite-plugin-mock";
import Mock from "mockjs"; // 引入 mockjs

// 模拟卡口名称
const kkmcList = [
  "卡口A",
  "卡口B",
  "卡口C",
  "卡口D",
  "卡口E",
  "卡口F",
  "卡口G",
  "卡口H",
  "卡口I",
  "卡口J",
];
// 模拟省份
const provinces = [
  "广东",
  "湖南",
  "湖北",
  "广西",
  "河南",
  "河北",
  "山东",
  "山西",
  "江苏",
  "浙江",
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
            KKMC: "@pick(kkmcList)", // 卡口名称
            HPHM: `粤B·@string("upper", 5)`, // 车牌号
            CLLX: `K@integer(1, 4)@integer(1, 4)`, // 车辆类型
            CPFSF: "@pick(provinces)", // 车牌附省份 (参考 交通流量数据字段说明.png)
            GCSJ: `@datetime("2025-11-01 HH:mm:ss")`, // 过车时间
            XZQHMC: "深圳市",
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
      const data = kkmcList
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
    // [接口 4] 大屏：车辆来源地图炮 (GET)
    url: "/api/stats/map_data",
    method: "get",
    response: () => {
      const data = provinces
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

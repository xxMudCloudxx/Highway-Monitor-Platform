import { MockMethod } from "vite-plugin-mock";
import Mock from "mockjs";

// --- 基础数据字典 (Data Dictionary) ---

// 1. 徐州卡口列表 (Top 10 & 随机生成用)
const kkmcList = [
  "京台高速K120+500",
  "徐州东收费站",
  "彭城路卡口",
  "二环北路卡口",
  "铜山G310-苏皖界",
  "贾汪G206-苏鲁界",
  "沛县G311-检查站",
  "连霍高速-徐州南",
  "睢宁G104-收费站",
  "新沂S505-高速口",
];

// 2. 徐州行政区划 (严格对应 xuzhou.json 的 name 字段)
const xzqhList = [
  "鼓楼区",
  "云龙区",
  "贾汪区",
  "泉山区",
  "铜山区",
  "丰县",
  "沛县",
  "睢宁县",
  "邳州市",
  "新沂市",
];

// 3. 车辆类型 (对应 VEHICLE_TYPE_NAME)
const vehicleTypes = [
  "小型客车",
  "中型客车",
  "大型客车",
  "货车",
  "专项作业车",
  "其他",
];

// 4. 车辆品牌 (对应 CLPPXH)
const vehicleBrands = [
  "大众",
  "丰田",
  "本田",
  "比亚迪",
  "特斯拉",
  "宝马",
  "奔驰",
  "奥迪",
  "吉利",
  "五菱",
];

export default [
  // ==========================================
  // [接口 1] 交互式查询 (POST /api/query)
  // ==========================================
  {
    url: "/api/query",
    method: "post",
    response: ({ body }: { body?: any }) => {
      const { page = 1, limit = 10 } = body || {};

      return {
        code: 200,
        msg: "success",
        data: {
          total: 1024,
          // 生成 mocks 列表
          records: Mock.mock({
            [`list|${limit}`]: [
              {
                "GCXH|+1": (page - 1) * limit + 1,
                // 从行政区列表中随机取一个
                XZQHMC: () => Mock.Random.pick(xzqhList),
                KKMC: () => Mock.Random.pick(kkmcList),
                // 模拟车牌: 苏C + 5位随机字符
                HPHM: /苏C[A-Z0-9]{5}/,
                "CLLX|1": ["K33", "K32", "H12", "M11"],
                GCSJ: "@datetime('yyyy-MM-dd HH:mm:ss')",
                // 随机增加一些额外字段用于测试
                VEHICLE_TYPE_NAME: () => Mock.Random.pick(vehicleTypes),
                CLPPXH: () => Mock.Random.pick(vehicleBrands),
                CPFSF: "",
              },
            ],
          }).list,
        },
      };
    },
  },

  // ==========================================
  // [接口 2] 大屏：卡口流量 Top 10 (GET)
  // ==========================================
  {
    url: "/api/stats/kkmc_count",
    method: "get",
    response: () => {
      // 生成 Top 10 数据
      const data = kkmcList
        .map((name) => ({
          name: name,
          value: Mock.Random.integer(1000, 10000),
        }))
        .sort((a, b) => b.value - a.value);

      return { code: 200, msg: "success", data };
    },
  },

  // ==========================================
  // [接口 3] 大屏：24小时流量曲线 (GET)
  // ==========================================
  {
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

  // ==========================================
  // [接口 4] 大屏：行政区划分布地图 (v1.3 修正) (GET)
  // ==========================================
  {
    url: "/api/stats/map_data",
    method: "get",
    response: () => {
      // 必须按徐州行政区聚合
      const data = xzqhList.map((name) => ({
        name: name,
        value: Mock.Random.integer(500, 15000),
      }));

      return { code: 200, msg: "success", data };
    },
  },

  // ==========================================
  // [接口 5] 大屏：车型占比 (v1.2 新增) (GET)
  // ==========================================
  {
    url: "/api/stats/vehicle_type",
    method: "get",
    response: () => {
      const data = [
        { name: "小型客车", value: Mock.Random.integer(5000, 10000) },
        { name: "货车", value: Mock.Random.integer(1000, 3000) },
        { name: "大型客车", value: Mock.Random.integer(500, 1500) },
        { name: "其他", value: Mock.Random.integer(100, 500) },
      ];
      return { code: 200, msg: "success", data };
    },
  },

  // ==========================================
  // [接口 6] 大屏：车辆品牌 (v1.2 新增) (GET)
  // ==========================================
  {
    url: "/api/stats/vehicle_brand",
    method: "get",
    response: () => {
      const data = vehicleBrands
        .slice(0, 6) // 只取前6个做展示
        .map((name) => ({
          name,
          value: Mock.Random.integer(200, 1000),
        }))
        .sort((a, b) => b.value - a.value);

      return { code: 200, msg: "success", data };
    },
  },
] as MockMethod[];

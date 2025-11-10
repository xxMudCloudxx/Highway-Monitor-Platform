// mock/algoApp.ts
import { MockMethod } from "vite-plugin-mock";
import Mock from "mockjs";

export default [
  {
    // [接口 5] 大屏：实时套牌车告警 (GET)
    url: "/api/warnings/realtime",
    method: "get",
    response: {
      code: 200,
      msg: "success",
      data: [
        `车牌 [${Mock.Random.pick(["粤B", "粤C", "湘A"])}·${Mock.Random.string(
          "upper",
          5
        )}] 疑似套牌: 3分钟内从 [卡口A] 移动到 [卡口B]`,
        `车牌 [${Mock.Random.pick(["粤B", "粤C", "湘A"])}·${Mock.Random.string(
          "upper",
          5
        )}] 疑似套牌: 2分钟内从 [卡口C] 移动到 [卡口D]`,
        `车牌 [${Mock.Random.pick(["粤B", "粤C", "湘A"])}·${Mock.Random.string(
          "upper",
          5
        )}] 疑似套牌: 1分钟内从 [卡口E] 移动到 [卡口F]`,
      ],
    },
  },
  {
    // [接口 6] 大屏：未来流量预测 (GET)
    url: "/api/predict/flow",
    method: "get",
    response: ({ query }: { query?: any }) => {
      const kkmc = query.kkmc || "全市";
      const hour = query.hour || new Date().getHours();
      return {
        code: 200,
        msg: "success",
        data: {
          kkmc: kkmc,
          hour: parseInt(String(hour), 10),
          predicted_flow: Mock.Random.integer(400, 600), // (C 需参考 杨再润-组长.pdf 实现)
        },
      };
    },
  },
] as MockMethod[];

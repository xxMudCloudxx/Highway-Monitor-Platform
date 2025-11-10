// src/pages/QueryPage.tsx
import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Table,
  Pagination,
  ConfigProvider, // 用于切换暗黑主题
  theme, // antd 主题
  Space,
  App as AntdApp, // 用于显示 message/notification，可选
} from "antd";
import { useQueryPageStore } from "../stores/useQueryPageStore";
import type { TableProps } from "antd";
import type { Dayjs } from "dayjs"; // antd 5 依赖 dayjs

// 1. (重要) 定义我们 API.md (接口 1) 中的数据记录类型
//    (基于 交通流量数据字段说明.png)
interface TrafficRecord {
  GCXH: number;
  KKMC: string;
  HPHM: string;
  GCSJ: string; // 后端返回的时间字符串
  CLLX: string;
  CPFSF: string;
}

// 2. (核心) 定义 Antd Table 的列
//    (这完全参考 高成-前端(交互式查询页面).pdf.pdf 和 image_4f4c27.jpg 的表格)
const columns: TableProps<TrafficRecord>["columns"] = [
  {
    title: "序号",
    dataIndex: "GCXH",
    key: "GCXH",
    width: 80,
  },
  {
    title: "车牌号",
    dataIndex: "HPHM",
    key: "HPHM",
    width: 120,
  },
  {
    title: "卡口名称",
    dataIndex: "KKMC",
    key: "KKMC",
    width: 150,
  },
  {
    title: "过车时间",
    dataIndex: "GCSJ",
    key: "GCSJ",
    width: 200,
  },
  {
    title: "车辆类型",
    dataIndex: "CLLX",
    key: "CLLX",
    width: 100,
  },
  {
    title: "车牌省份",
    dataIndex: "CPFSF",
    key: "CPFSF",
    width: 100,
  },
];

const { RangePicker } = DatePicker;

// 3. (核心) 页面组件
export const QueryPage = () => {
  // 3.1. 从 Zustand Store 中获取所有状态和动作
  const { params, data, loading, setParams, fetchData } = useQueryPageStore();

  // 3.2. 获取 Antd Form 的实例
  const [form] = Form.useForm();

  // 3.3. 组件首次加载时，获取一次数据
  useEffect(() => {
    fetchData();
  }, [fetchData]); // 依赖项是 zustand action，只会执行一次

  // 3.4. (处理查询)
  // 当表单点击 "查询" 按钮时
  const onFinish = (values: {
    hphm?: string;
    kkmc?: string;
    timeRange?: [Dayjs, Dayjs];
  }) => {
    const { kkmc, hphm, timeRange } = values;

    let startTime = null;
    let endTime = null;

    // (格式化 antd 的 dayjs 时间)
    if (timeRange && timeRange.length === 2) {
      startTime = timeRange[0].format("YYYY-MM-DD HH:mm:ss");
      endTime = timeRange[1].format("YYYY-MM-DD HH:mm:ss");
    }

    // (关键) 更新 store 中的 params，并重置到第1页，然后触发 fetchData
    setParams({
      kkmc: kkmc || null,
      hphm: hphm || null,
      startTime: startTime,
      endTime: endTime,
      page: 1, // (重要) 新的搜索总是从第 1 页开始
    });

    // fetchData 会自动从 store 中读取最新的 params
    fetchData();
  };

  // 3.5. (处理重置)
  const onReset = () => {
    form.resetFields(); // 清空 antd 表单
    // (关键) 将 store 中的 params 也重置，并触发 fetchData
    setParams({
      kkmc: null,
      hphm: null,
      startTime: null,
      endTime: null,
      page: 1,
      limit: 10, // 假设 limit 保持不变
    });
    fetchData();
  };

  // 3.6. (处理分页)
  const onPaginationChange = (page: number, pageSize: number) => {
    // (关键) 更新 store 中的 page 和 limit，并触发 fetchData
    setParams({ page, limit: pageSize });
    fetchData();
  };

  // 4. 渲染 UI
  return (
    <div className="p-5 min-h-screen">
      <h1 className="text-2xl mb-4 text-white">交互式查询 (Mock)</h1>

      {/* 4.1. 搜索表单 (参考 image_4f4c27.jpg) */}
      <Form form={form} layout="inline" onFinish={onFinish} className="mb-4">
        <Form.Item name="hphm">
          <Input placeholder="车牌号 (e.g., 粤B)" />
        </Form.Item>
        <Form.Item name="kkmc">
          <Input placeholder="卡口名称 (e.g., 卡口A)" />
        </Form.Item>
        <Form.Item name="timeRange">
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 4.2. 数据表格 */}
      <Table
        columns={columns}
        dataSource={data.records}
        loading={loading}
        rowKey="GCXH" // 使用 GCXH 作为 key
        pagination={false} // (重要) 我们使用外部独立的分页器
        bordered
        className="mb-4 mt-4"
      />

      {/* 4.3. 独立分页器 (参考 高成.pdf) */}
      <Pagination
        showSizeChanger // 允许切换每页条数
        current={params.page}
        pageSize={params.limit}
        total={data.total}
        onChange={onPaginationChange}
        showTotal={(total) => `共 ${total} 条记录`}
      />
    </div>
  );
};

// 5. (推荐) 使用 Antd App 包裹，并启用暗黑主题
const QueryPageWrapper = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm, // 启用暗黑主题
    }}
  >
    <AntdApp>
      {" "}
      {/* 必须包裹，否则 message, notification 等无法使用 */}
      <div className="bg-[#141414] min-h-screen">
        {" "}
        {/* 暗黑背景 */}
        <QueryPage />
      </div>
    </AntdApp>
  </ConfigProvider>
);

export default QueryPageWrapper;

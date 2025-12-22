/**
 * @file src/pages/QueryPage.tsx
 * @module QueryPage
 * @description (页面) 交互式查询
 *
 * 职责:
 * 1. 渲染 Antd 的 Form, Table, Pagination。
 * 2. (核心) 绑定 zustand store (useQueryPageStore)。
 * 3. (核心) 将用户输入 (表单、分页) 转换为 store 的 action (调用 API 1)。
 */

import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Table,
  Pagination,
  Space,
  App as AntdApp,
  Select, // (用于显示 message/notification)
} from "antd";
import { useQueryPageStore } from "../stores/useQueryPageStore";
import type { TableProps } from "antd";
import type { Dayjs } from "dayjs"; // (antd 5 依赖 dayjs)
import {
  formatKkmc,
  KKMC_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  formatProvince,
} from "../utils/dict";
import { formatTime } from "../utils/format";

// --- 1. (类型定义) ---

/**
 * @interface TrafficRecord
 * @description [接口 1] 返回数据中 `records` 数组的单条记录格式
 * (字段基于 交通流量数据字段说明.png)
 */
interface TrafficRecord {
  GCXH: number;
  KKMC: string;
  HPHM: string;
  GCSJ: string; // 后端返回的时间字符串
  CLLX: string;
  CPFSF: string;
}

// --- 2. (Antd Table 定义) ---

/**
 * (核心) Antd Table 的列定义
 */
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
    render: (name) => formatKkmc(name),
  },
  {
    title: "过车时间",
    dataIndex: "GCSJ",
    key: "GCSJ",
    width: 200,
    render: (text) => formatTime(text),
  },
  {
    title: "车辆类型",
    dataIndex: "VEHICLE_TYPE_NAME",
    key: "VEHICLE_TYPE_NAME",
    width: 100,
  },
  {
    title: "车牌省份",
    dataIndex: "PROVINCE",
    key: "PROVINCE",
    width: 120,
    render: (abbr) => formatProvince(abbr),
  },
  {
    title: "车辆种类",
    dataIndex: "FUEL_TYPE",
    key: "FUEL_TYPE",
    width: 100,
  },
];

const { RangePicker } = DatePicker;

// --- 3. (React 组件) ---

/**
 * 交互式查询页面 (业务组件)
 * (此组件不含 Antd Provider，由 Wrapper 提供)
 * @returns {React.ReactElement}
 */
export const QueryPage = () => {
  // 3.1. (Zustand) 获取所有状态和动作
  const { params, data, loading, setParams, fetchData } = useQueryPageStore();

  // 3.2. (Antd Form) 获取 Form 实例
  const [form] = Form.useForm();

  // 3.3. (React Hook)
  useEffect(() => {
    // Why: 页面首次加载时，获取一次默认数据
    fetchData();
  }, [fetchData]); // (依赖项是 zustand action，仅在挂载时运行一次)

  /**
   * (处理查询) Antd Form 提交处理函数
   *
   * @param {object} values - 表单原始值 (包含 dayjs 对象)
   */
  const onFinish = (values: {
    hphm?: string;
    kkmc?: string;
    timeRange?: [Dayjs, Dayjs];
    vehicleType?: string;
    province?: string;
    fuelType?: string;
  }) => {
    const { kkmc, hphm, timeRange, vehicleType, province, fuelType } = values;
    console.log(timeRange);

    let startTime = null;
    let endTime = null;

    // (格式化 antd 的 dayjs 时间)
    if (timeRange && timeRange.length === 2) {
      startTime = timeRange[0].format("YYYY-MM-DD HH:mm:ss");
      endTime = timeRange[1].format("YYYY-MM-DD HH:mm:ss");
    }

    // (关键) 更新 store 中的 params，并重置到第1页
    setParams({
      kkmc: kkmc || null,
      hphm: hphm || null,
      startTime: startTime,
      endTime: endTime,
      vehicleType: vehicleType || null,
      province: province || null,
      fuelType: fuelType || null,
      page: 1, // Why: 新的搜索总是从第 1 页开始
    });

    // (fetchData 会自动从 store 中读取最新的 params)
    fetchData();
  };

  /**
   * (处理重置) Antd Form 重置处理函数
   */
  const onReset = () => {
    form.resetFields(); // (清空 antd 表单)
    // (关键) 将 store 中的 params 也重置
    setParams({
      kkmc: null,
      hphm: null,
      startTime: null,
      endTime: null,
      vehicleType: null,
      province: null,
      fuelType: null,
      page: 1,
      limit: 10,
    });
    fetchData();
  };

  /**
   * (处理分页) Antd Pagination 切换处理函数
   *
   * @param {number} page - 目标页码
   * @param {number} pageSize - 目标每页条数
   */
  const onPaginationChange = (page: number, pageSize: number) => {
    // (关键) 更新 store 中的 page 和 limit
    setParams({ page, limit: pageSize });
    fetchData();
  };

  // 4. (渲染)
  return (
    <div className="p-5 min-h-full">
      <h1 className="text-2xl mb-4 text-white">交互式查询</h1>

      {/* 4.1. 搜索表单  */}
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        className="mb-4 flex flex-wrap gap-y-3"
      >
        <Form.Item name="hphm">
          <Input placeholder="车牌号 (e.g., 粤B)" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="kkmc">
          <Select
            placeholder="请选择卡口名称"
            style={{ width: 200 }}
            allowClear
            showSearch // 允许用户打字搜索中文
            optionFilterProp="label" // 搜索时匹配 label (中文名)
            value={params.kkmc} // 绑定 Store 中的 kkmc
            onChange={(value) => setParams({ kkmc: value })} // 选完自动更新 Store
            options={KKMC_OPTIONS}
          />
        </Form.Item>
        <Form.Item name="vehicleType">
          <Select
            placeholder="车辆类型"
            style={{ width: 130 }}
            allowClear
            showSearch
            optionFilterProp="label"
            value={params.vehicleType}
            onChange={(value) => setParams({ vehicleType: value })}
            options={VEHICLE_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item name="province">
          <Select
            placeholder="车牌省份"
            style={{ width: 180 }}
            allowClear
            showSearch
            optionFilterProp="label"
            value={params.province}
            onChange={(value) => setParams({ province: value })}
            options={PROVINCE_OPTIONS}
          />
        </Form.Item>
        <Form.Item name="fuelType">
          <Select
            placeholder="车辆种类"
            style={{ width: 130 }}
            allowClear
            showSearch
            optionFilterProp="label"
            value={params.fuelType}
            onChange={(value) => setParams({ fuelType: value })}
            options={FUEL_TYPE_OPTIONS}
          />
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
        rowKey="GCXH" // (使用 GCXH 作为 key)
        pagination={false}
        bordered
        className="mb-4 mt-4"
      />

      {/* 4.3. 独立分页器 */}
      <Pagination
        showSizeChanger // (允许切换每页条数)
        current={params.page}
        pageSize={params.limit}
        total={data.total}
        onChange={onPaginationChange}
        showTotal={(total) => `共 ${total} 条记录`}
      />
    </div>
  );
};

/**
 * (Wrapper) 使用 Antd App 包裹，并启用暗黑主题
 * (Why: AntdApp 用于 message, notification 等弹出)
 * @returns {React.ReactElement}
 */
const QueryPageWrapper = () => (
  <AntdApp>
    <div className="bg-[#141414] min-h-full">
      <QueryPage />
    </div>
  </AntdApp>
);

export default QueryPageWrapper;

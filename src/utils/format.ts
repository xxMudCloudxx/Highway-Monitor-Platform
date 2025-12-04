// utils/format.js 或写在组件文件顶部
export const formatTime = (gmtString: any) => {
  if (!gmtString) return "-";
  const date = new Date(gmtString);
  // 转换为本地时间字符串 (例如: 2025/2/7 15:28:13)
  return date.toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
};

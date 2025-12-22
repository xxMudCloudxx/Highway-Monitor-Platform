// utils/format.ts
/**
 * 格式化时间字符串
 * 注意: 后端返回的是 GMT 格式 (如 'Tue, 07 Jan 2025 20:24:08 GMT')
 * 我们需要直接显示 UTC 时间，不做本地时区转换
 */
export const formatTime = (dateString: any): string => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString; // 无法解析则返回原字符串
    }

    // 使用 UTC 时间，避免时区转换 (+8小时问题)
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString; // 出错则返回原字符串
  }
};

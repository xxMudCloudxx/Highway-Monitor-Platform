// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. (新增) 定义 keyframes
      keyframes: {
        "scroll-y": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" }, // 滚动到 -50% (因为我们会复制一份)
        },
      },
      // 2. (新增) 注册 animation
      animation: {
        "scroll-y": "scroll-y 30s linear infinite", // 30秒滚动一轮，线性，无限
      },
    },
  },
  plugins: [],
};

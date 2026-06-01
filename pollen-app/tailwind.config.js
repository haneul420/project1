export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        level: {
          low: '#22c55e',    // 초록
          normal: '#eab308', // 노랑
          high: '#f97316',   // 주황
          veryHigh: '#ef4444'// 빨강
        }
      }
    },
  },
  plugins: [],
}

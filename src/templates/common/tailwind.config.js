import { join } from 'path';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue,css}', // 确保扫描所有组件和 CSS
  ],
  theme: {
    extend: {
      //v4 特性：默认不生成自定义别名，必须在 extend.colors 明确配置。
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#d6e4ff',
          200: '#adc8ff',
          300: '#85a9ff',
          400: '#597ef7',
          500: '#2f54eb',
          600: '#1d39c4',
          700: '#10239e',
          800: '#061178',
          900: '#030852',
        },
        secondary: {
          50: '#fff0f6',
          100: '#ffd6e0',
          200: '#ffadc0',
          300: '#ff85a3',
          400: '#f75975',
          500: '#eb2f6f',
          600: '#c41d62',
          700: '#9e1053',
          800: '#780745',
          900: '#520337',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

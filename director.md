my-app/
├─ .vscode/                # VSCode 配置（可选）
├─ public/                 # 静态资源，直接映射到根目录
│   └─ favicon.ico
├─ src/
│  ├─ assets/              # 图片、图标、静态资源
│  ├─ components/          # 通用组件（Button, Card, Layout）
│  ├─ features/            # 独立功能模块（如 blog, auth, tools）
│  │   ├─ blog/            # 博客相关
│  │   │   ├─ components/  # Blog 专用组件
│  │   │   ├─ hooks/       # Blog 相关 hook
│  │   │   ├─ services/    # API 调用
│  │   │   └─ pages/       # Blog 页面
│  │   └─ auth/            # 登录注册模块
│  ├─ hooks/               # 全局通用 hook（如 useFetch, useDarkMode）
│  ├─ lib/                 # 工具库封装（如 axios 实例化, markdown 解析器）
│  ├─ pages/               # 路由页面（Home, About, 404）
│  ├─ routes/              # React Router 配置
│  ├─ store/               # 状态管理（可选：Zustand/Recoil/Redux）
│  ├─ styles/              # 全局样式（tailwind.css / scss）
│  ├─ types/               # 全局类型定义（TypeScript d.ts）
│  ├─ utils/               # 工具函数（如 formatDate, debounce）
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .env                    # 环境变量（如 API 地址）
├─ .gitignore
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts

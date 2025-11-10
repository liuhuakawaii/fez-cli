# Petite Vue 3 Starter

一个「小而美」的 Vue 3 + TypeScript + Vite 前端模板，围绕真实小项目需求整理了最常用的工程化基建：目录规范、全局状态、API 封装、Toast 通知、样式系统等。开箱即可作为个人或团队的轻量项目脚手架。

## ✨ 特性亮点

- 🧭 **清爽结构**：`src/` 分类到位，包含 `pages`、`components`、`store`、`services`、`styles`、`composables`
- 🗃 **Pinia 全局状态**：示例 `useAppStore`、`useToastStore` 覆盖基础数据与通知管理
- 🌐 **Axios 封装**：统一 `baseURL`、错误提示拦截器、导出业务 API 函数
- 🔔 **Toast 系统**：无需额外依赖，Pinia + 组件完成全局消息通知
- 🏠 **Home 演示页**：囊括全局状态读写、API 请求、Toast 触发、Tailwind 组合
- 🎨 **设计基础**：Tailwind 4 + 自定义 `theme.css`，即用即拓展
- ✅ **TypeScript & Vite**：严格类型、即时热更新、最佳开发体验

## 🚀 快速开始

```bash
# 安装依赖（推荐使用 pnpm）
pnpm install

# 运行开发环境
pnpm dev

# 构建生产版本
pnpm build

# 预览构建产物
pnpm preview
```

建议创建 `.env` 文件设置 API 地址等变量：

```bash
VITE_APP_TITLE=vueaaa
VITE_API_URL=https://jsonplaceholder.typicode.com
```

## 📁 目录约定

```
src/
├── components/       # 基础组件（例如 ToastHost）
├── composables/      # 组合式工具（useToast）
├── pages/            # 页面入口（HomePage）
├── router/           # 路由定义
├── services/         # Axios 封装与业务 API
├── store/            # Pinia 模块
│   └── modules/      # 具体 store（app、toast）
├── styles/           # 自定义样式与 tokens
├── App.vue           # 根组件，包含布局与 RouterView
└── main.ts           # 应用入口，注册 Pinia、Router、全局样式
```

## 🧩 核心模块

### 全局状态（Pinia）

- `useAppStore`：演示用户昵称、待办列表、加载状态等常见场景
- `useToastStore`：统一管理消息队列，提供 `push / dismiss / clear`

```12:35:src/store/modules/app.ts
export const useAppStore = defineStore('app', () => {
  const username = ref('Vue Explorer')
  const todos = ref<Todo[]>([])
  const isLoadingTodos = ref(false)
  // ...
})
```

### Axios 封装

`src/services/http.ts` 建立默认实例，注入错误拦截器并触发 toast 提示；`src/services/todos.ts` 提供业务 API 示例。

```5:26:src/services/http.ts
class HttpClient {
  private instance: AxiosInstance
  constructor() {
    this.instance = axios.create({ baseURL, timeout: 10_000 })
    this.setupInterceptors()
  }
  // ...
}
```

### Toast 通知

无第三方依赖，通过 Pinia store + 组合式函数 + `ToastHost` 组件实现。

```1:36:src/components/ToastHost.vue
<transition-group>
  <div v-for="toast in messages" :key="toast.id" class="...">
    <p class="text-sm font-semibold">{{ toast.title }}</p>
    <button @click="dismiss(toast.id)">Close</button>
  </div>
</transition-group>
```

### Home 演示页

在 `HomePage.vue` 中串联所有能力：修改昵称（全局状态）、调用 `fetchTodos`（Axios 封装）、展示 todo 数据、触发各类型 toast。

```9:28:src/pages/HomePage.vue
async function loadTodos() {
  appStore.setTodosLoading(true)
  const response = await fetchTodos(todoLimit.value)
  appStore.setTodos(response.data)
  success('Todos updated', `Loaded ${response.data.length} items`)
}
```

## 🛠 常用脚本

| 命令          | 说明                     |
| ------------- | ------------------------ |
| `pnpm dev`    | 本地开发，启动 Vite      |
| `pnpm build`  | 打包生产代码             |
| `pnpm preview`| 预览打包产物             |
| `pnpm lint`   | ESLint 检查              |
| `pnpm format` | 使用 Prettier 格式化代码 |

## 🧱 下一步可以做什么

- 扩展更多 `pages/` 与 `router` 路由
- 在 `services/` 中编写实际业务接口
- 根据设计体系补充更多 `styles/` 或 Tailwind Presets
- 衍生组件库或主题切换等进阶能力

---

Enjoy building with **fez-cli** 💡


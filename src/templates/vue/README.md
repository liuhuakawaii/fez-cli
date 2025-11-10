# fez-cli

一个现代化的 React + TypeScript 项目初始化模板，采用最佳实践和完整的开发架构。

## ✨ 特性

- 🚀 **React 18** + **TypeScript** + **Vite** - 现代化开发体验
- 🎨 **Tailwind CSS** - 完整的设计系统和组件样式库
- 🔥 **智能 API 管理** - 内置拦截器、重试机制、错误处理
- 🛡️ **类型安全** - 完善的 TypeScript 类型定义
- 🎯 **React Hooks** - 封装常用数据获取模式
- 📱 **响应式设计** - 移动端优先的布局系统
- 🚨 **错误边界** - 优雅的错误处理和用户提示
- ⚡ **性能优化** - 请求取消、防抖、缓存等机制
- 🔒 **代码质量保证** - Husky + lint-staged 自动检查

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **路由管理**: React Router DOM
- **HTTP 客户端**: 自研 API 客户端
- **代码规范**: ESLint + TypeScript

## 🚀 快速开始

### 环境准备
```bash
# Node.js 版本要求: >= 16
node --version

# 推荐使用 pnpm
npm install -g pnpm
```

### 安装和启动
```bash
# 克隆项目
git clone <your-repo-url>
cd liuhuakawaii-playground

# 安装依赖
npm install
# 或者使用 pnpm
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置你的 API 地址等

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ErrorBoundary.tsx  # 错误边界组件
│   ├── Loading.tsx        # 加载状态组件
│   ├── Layout.tsx         # 布局组件
│   └── Button.tsx         # 按钮组件
├── hooks/              # 自定义 Hooks
│   └── useFetch.ts        # 数据获取 Hook
├── lib/                # 核心库
│   └── api.ts             # API 客户端
├── types/              # 类型定义
│   ├── api.ts             # API 相关类型
│   ├── common.ts          # 通用类型
│   └── index.ts           # 类型导出
├── constants/          # 常量配置
│   └── index.ts           # 应用常量
├── utils/              # 工具函数
│   ├── cn.ts              # 样式类名合并
│   └── formatDate.ts      # 日期格式化
├── features/           # 业务功能模块
│   └── auth/              # 认证相关
├── pages/              # 页面组件
│   ├── Home.tsx
│   ├── About.tsx
│   └── NotFound.tsx
├── routers/            # 路由配置
│   ├── index.ts
│   └── routes.tsx
└── styles/             # 样式文件
    └── index.css          # 全局样式和 Tailwind
```

## 🎯 核心功能使用指南

### 1. API 管理

#### 直接使用 API 客户端（推荐用于增删改操作）
```typescript
import { apiClient, handleApiError } from '@/lib/api'

// GET 请求
const users = await apiClient.get<User[]>('/api/users')

// POST 请求
const newUser = await apiClient.post('/api/users', {
  name: '张三',
  email: 'zhang@example.com'
})

// 错误处理
try {
  await apiClient.delete(`/api/users/${userId}`)
} catch (error) {
  alert('删除失败：' + handleApiError(error))
}
```

#### 使用 React Hooks（推荐用于数据获取）
```typescript
import { useFetch, useSearchFetch, usePaginatedFetch } from '@/hooks/useFetch'

// 基础数据获取
function UserList() {
  const { data, isLoading, error, refetch } = useFetch<User[]>('/api/users')
  
  if (isLoading) return <Loading />
  if (error) return <div>错误: {error}</div>
  
  return (
    <div>
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={refetch}>刷新</button>
    </div>
  )
}

// 搜索功能（内置防抖）
function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: products } = useSearchFetch('/api/products/search', searchTerm)
  
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索产品..."
      />
      {products?.map(product => <div key={product.id}>{product.name}</div>)}
    </div>
  )
}

// 分页数据
function ProductList() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = usePaginatedFetch('/api/products', { page, pageSize: 10 })
  
  return (
    <div>
      {data?.data.map(product => <div key={product.id}>{product.name}</div>)}
      <button onClick={() => setPage(p => p + 1)}>下一页</button>
    </div>
  )
}

// 手动触发的数据获取
function ManualFetch() {
  const { data, isLoading, refetch } = useFetch('/api/data', { 
    immediate: false  // 不会自动执行
  })
  
  return (
    <button onClick={refetch} disabled={isLoading}>
      {isLoading ? '加载中...' : '获取数据'}
    </button>
  )
}
```

### 2. 样式系统

#### 使用预定义的设计系统
```tsx
// 使用预定义的组件样式类
<div className="card">
  <h2 className="text-heading-2">用户信息</h2>
  <p className="text-body">这是用户的详细信息</p>
  <div className="flex gap-3">
    <button className="btn-primary">保存</button>
    <button className="btn-outline">取消</button>
  </div>
</div>

// 使用自定义颜色系统
<div className="bg-primary-500 text-white p-4 rounded-lg">
  主要内容区域
</div>

<div className="bg-success-50 border border-success-200 text-success-800 p-3 rounded">
  ✅ 操作成功提示
</div>
```

#### 响应式布局
```tsx
// 使用响应式容器
<div className="container-responsive">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map(item => (
      <div key={item.id} className="card-hover">
        {item.content}
      </div>
    ))}
  </div>
</div>
```

### 3. 错误处理

#### 全局错误边界
```tsx
// 已在 main.tsx 中配置，自动捕获组件错误
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### 自定义错误处理
```tsx
function MyComponent() {
  const { data, error } = useFetch('/api/data', {
    onError: (error) => {
      // 自定义错误处理
      console.error(`加载失败: ${error}`)
    }
  })
  
  return <div>{/* 组件内容 */}</div>
}
```

### 4. 类型定义

#### 定义业务类型
```typescript
// src/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
}

// 使用通用类型
export interface UserListResponse extends PaginatedResponse<User> {}
```

## 🎨 设计系统

### 颜色系统
- **主色调**: `primary-*` (蓝色系)
- **辅助色**: `secondary-*` (灰色系)
- **状态色**: `success-*`, `warning-*`, `error-*`

### 组件样式类
- **卡片**: `.card`, `.card-hover`
- **按钮**: `.btn-primary`, `.btn-secondary`, `.btn-outline`
- **输入框**: `.input-base`, `.input-error`
- **文本**: `.text-heading-1`, `.text-body`, `.text-body-small`

### 工具类
- **容器**: `.container-responsive`
- **动画**: `.animate-fade-in`, `.animate-slide-up`
- **文本截断**: `.truncate-2`, `.truncate-3`

## 🔧 开发指南

### 1. 组件开发规范
```tsx
/**
 * 组件说明
 * 描述组件的用途和使用场景
 */

import { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

interface MyComponentProps extends ComponentProps<'div'> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export default function MyComponent({ 
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props 
}: MyComponentProps) {
  return (
    <div 
      className={cn(
        'base-classes',
        variant === 'primary' && 'primary-classes',
        size === 'lg' && 'large-classes',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### 2. API 接口开发
```typescript
// src/api/users.ts
import { apiClient } from '@/lib/api'
import type { User, CreateUserRequest, PaginatedResponse } from '@/types'

export const userApi = {
  // 获取用户列表
  getUsers: (params?: { page?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }),
  
  // 获取用户详情
  getUser: (id: string) =>
    apiClient.get<User>(`/users/${id}`),
  
  // 创建用户
  createUser: (data: CreateUserRequest) =>
    apiClient.post<User>('/users', data),
  
  // 更新用户
  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id: string) =>
    apiClient.delete(`/users/${id}`)
}
```

### 3. 页面组件开发
```tsx
// src/pages/Users.tsx
import { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { apiClient, handleApiError } from '@/lib/api'
import { User } from '@/types'
import Loading from '@/components/Loading'

export default function UsersPage() {
  const { data: users, isLoading, refetch } = useFetch<User[]>('/api/users')
  
  const handleCreateUser = async (userData: any) => {
    try {
      await apiClient.post('/api/users', userData)
      refetch() // 刷新列表
      alert('用户创建成功')
    } catch (error) {
      alert('创建失败：' + handleApiError(error))
    }
  }
  
  if (isLoading) return <Loading text="加载用户列表..." />
  
  return (
    <div className="container-responsive">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading-1">用户管理</h1>
        <button 
          onClick={() => handleCreateUser({ name: '新用户', email: 'test@example.com' })}
          className="btn-primary"
        >
          创建用户
        </button>
      </div>
      
      <div className="grid gap-4">
        {users?.map(user => (
          <div key={user.id} className="card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 📝 环境配置

### 环境变量
```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=liuhuakawaii-playground
VITE_APP_VERSION=0.1.0
VITE_DEV_MODE=true
```

### TypeScript 配置
项目已配置路径映射，可以使用 `@/` 别名：
```typescript
import { apiClient } from '@/lib/api'
import { User } from '@/types'
import Button from '@/components/Button'
```

## 🧪 测试

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 错误
npm run lint:fix

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

### Git 钩子
项目配置了 Husky + lint-staged，每次提交时会自动：
- 检查和修复代码规范问题
- 格式化代码
- 确保代码质量

```bash
# 正常提交（会自动触发检查）
git add .
git commit -m "feat: add new feature"

# 跳过检查（紧急情况）
git commit -m "urgent fix" --no-verify
```

## 📦 构建和部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 构建产物在 dist/ 目录
```

## 🔄 最佳实践

### 1. 数据获取策略
- **页面级数据**: 使用 `useFetch` Hook，`immediate: true`
- **用户操作**: 使用 `apiClient` 直接调用
- **搜索功能**: 使用 `useSearchFetch`
- **分页列表**: 使用 `usePaginatedFetch`
- **按钮触发**: 使用 `useFetch` 的 `refetch` 或设置 `immediate: false`

### 2. Hook vs 直接调用的选择

| 场景 | 推荐方式 | 示例 |
|------|----------|------|
| 页面加载时获取数据 | `useFetch` | 用户列表、文章列表 |
| 按钮点击获取数据 | `useFetch` + `refetch` | 刷新按钮、查询按钮 |
| 表单提交 | `apiClient` 直接调用 | 创建、更新、删除 |
| 搜索功能 | `useSearchFetch` | 实时搜索 |
| 分页数据 | `usePaginatedFetch` | 列表分页 |

### 3. 错误处理策略
- **全局错误**: ErrorBoundary 自动捕获
- **API 错误**: 使用 `handleApiError` 统一处理
- **用户提示**: 结合 alert 或 toast 库显示友好提示

### 4. 性能优化
- 使用 `React.memo` 优化组件渲染
- API 请求自动支持取消和重试
- 合理使用 `useCallback` 和 `useMemo`

## 🚧 后续规划

### 短期优化
- [ ] 添加单元测试覆盖
- [ ] 集成 Storybook 组件文档
- [ ] 添加 Husky git hooks
- [ ] Toast 通知组件

### 中期优化  
- [ ] 状态管理集成 (Zustand)
- [ ] PWA 支持
- [ ] 国际化 (i18n)
- [ ] 主题切换功能

### 长期优化
- [ ] 微前端架构支持
- [ ] 性能监控集成
- [ ] 自动化部署流程

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

MIT License

## 📞 联系方式

- 项目地址: [GitHub Repository](https://github.com/liuhuakawaii/fez-cli)
- 问题反馈: [Issues](https://github.com/liuhuakawaii/fez-cli/issues)

---

⭐ 如果这个项目对你有帮助，请给一个 Star！
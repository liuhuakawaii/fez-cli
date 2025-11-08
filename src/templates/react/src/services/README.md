# API 服务使用指南

本文档介绍如何使用基于 axios 的 API 客户端和错误处理机制。

## 快速开始

### 基础使用

```typescript
import { request } from '@/services'

// GET 请求
const data = await request.get('/api/users')

// POST 请求
const result = await request.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
})

// PUT 请求
await request.put('/api/users/1', { name: 'Jane' })

// DELETE 请求
await request.delete('/api/users/1')
```

### 使用 Hook

```typescript
import { useFetch } from '@/hooks/useFetch'

function UserList() {
  const { data, isLoading, error, refetch } = useFetch('/api/users')
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return (
    <div>
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  )
}
```

## 错误处理

### 自动错误提示

默认情况下，所有请求失败都会自动显示错误提示：

```typescript
// 自动显示错误提示
await request.get('/api/users')
```

### 自定义错误提示

```typescript
// 自定义错误消息
await request.get('/api/users', {
  errorTip: '获取用户列表失败，请稍后重试'
})

// 禁用自动错误提示（手动处理）
try {
  await request.get('/api/users', {
    showErrorTip: false
  })
} catch (error) {
  // 手动处理错误
  console.error(error)
}
```

### 使用 useToast Hook 自定义提示

```typescript
import { useToast } from '@/hooks/useToast'
import { request } from '@/services'

function MyComponent() {
  const { showError, showSuccess } = useToast()
  
  const handleSubmit = async () => {
    try {
      await request.post('/api/users', { name: 'John' }, {
        showErrorTip: false // 禁用自动提示
      })
      showSuccess('用户创建成功！')
    } catch (error) {
      showError('创建失败，请检查网络连接')
    }
  }
  
  return <button onClick={handleSubmit}>提交</button>
}
```

### 使用 ErrorHandler 处理错误

```typescript
import { ErrorHandler, ErrorType } from '@/services'
import { request } from '@/services'

try {
  await request.get('/api/users')
} catch (error) {
  const handler = new ErrorHandler(error)
  
  // 获取错误类型
  if (handler.isNetworkError()) {
    console.log('网络错误')
  }
  
  // 获取错误消息
  const message = handler.getMessage()
  
  // 显示提示
  handler.showTip('自定义错误消息')
}
```

## 重试机制

### 指数回退重试

默认情况下，以下错误会自动重试（最多3次）：
- 网络错误
- 5xx 服务器错误
- 429 请求过多

重试延迟时间采用指数回退策略：
- 第1次重试：约 1-1.3 秒
- 第2次重试：约 2-2.6 秒
- 第3次重试：约 4-5.2 秒

### 自定义重试配置

```typescript
// 自定义重试次数
await request.get('/api/users', {
  retries: 5 // 最多重试5次
})

// 禁用重试
await request.get('/api/users', {
  enableRetry: false
})
```

## 文件上传

```typescript
import { request } from '@/services'

// 基础上传
const result = await request.upload('/api/upload', file)

// 带进度回调的上传
await request.upload('/api/upload', file, {}, (progress) => {
  console.log(`上传进度: ${progress}%`)
})
```

## 取消请求

```typescript
import { useFetch } from '@/hooks/useFetch'

function MyComponent() {
  const { cancel } = useFetch('/api/users')
  
  // 取消请求
  const handleCancel = () => {
    cancel()
  }
  
  return <button onClick={handleCancel}>取消</button>
}
```

## 在 Hook 中使用

### useFetch 配置

```typescript
import { useFetch } from '@/hooks/useFetch'

function MyComponent() {
  const { data, isLoading, error } = useFetch('/api/users', {
    // 禁用自动错误提示，使用 onError 回调
    showErrorTip: false,
    onError: (errorMessage) => {
      console.error('自定义错误处理:', errorMessage)
    },
    onSuccess: (data) => {
      console.log('数据加载成功:', data)
    },
    // 自定义重试配置
    retries: 5,
    enableRetry: true
  })
  
  // ...
}
```

## 常见错误类型

```typescript
import { ErrorType } from '@/services'

// 错误类型包括：
// - ErrorType.NETWORK: 网络连接失败
// - ErrorType.TIMEOUT: 请求超时
// - ErrorType.UNAUTHORIZED: 未授权（401）
// - ErrorType.FORBIDDEN: 禁止访问（403）
// - ErrorType.NOT_FOUND: 资源不存在（404）
// - ErrorType.SERVER_ERROR: 服务器错误（5xx）
// - ErrorType.VALIDATION_ERROR: 参数验证失败（4xx）
// - ErrorType.UNKNOWN: 未知错误
```

## 最佳实践

1. **统一错误处理**：在业务组件中使用 `showErrorTip: false` 禁用自动提示，然后使用 `useToast` hook 统一处理错误提示

2. **合理使用重试**：对于幂等操作（GET、PUT、DELETE），可以启用重试；对于非幂等操作（POST），谨慎使用重试

3. **错误边界**：结合 React ErrorBoundary 处理未捕获的错误

4. **类型安全**：使用 TypeScript 类型定义确保类型安全

```typescript
interface User {
  id: string
  name: string
  email: string
}

// 类型安全的请求
const users = await request.get<User[]>('/api/users')
```


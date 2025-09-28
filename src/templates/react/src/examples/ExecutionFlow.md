# Hook 执行机制详解

## 🔄 useFetch 的执行流程

### 1. 组件挂载时
```typescript
// immediate = true (默认)
const { data, isLoading } = useFetch('/api/users')

// 执行顺序：
// 1. 组件挂载
// 2. useFetch 初始化，isLoading = true
// 3. useEffect 触发，检查 immediate === true
// 4. 调用 fetchData()
// 5. 发送 API 请求
// 6. 请求成功：setState({ data, isLoading: false, error: null })
// 7. 组件重新渲染，显示数据
```

### 2. 手动触发时
```typescript
// immediate = false，不会自动执行
const { data, isLoading, refetch } = useFetch('/api/users', { immediate: false })

// 执行顺序：
// 1. 组件挂载
// 2. useFetch 初始化，isLoading = false (因为 immediate = false)
// 3. useEffect 触发，但 immediate === false，不执行请求
// 4. 用户点击按钮，调用 refetch()
// 5. fetchData() 被调用
// 6. 发送 API 请求
// 7. 更新状态和重新渲染
```

### 3. 依赖变化时
```typescript
const [userId, setUserId] = useState('1')
const { data } = useFetch(`/api/users/${userId}`, { 
  deps: [userId] 
})

// 执行顺序：
// 1. userId 变化 (比如从 '1' 变为 '2')
// 2. fetchData 的 useCallback 依赖 [endpoint, ...deps] 发生变化
// 3. useEffect([fetchData, immediate]) 重新执行
// 4. 如果 immediate = true，自动发送新请求
// 5. 如果 immediate = false，需要手动调用 refetch()
```

## 🎛️ 控制执行的策略

### 策略 1: 页面加载时自动获取
```typescript
// ✅ 适用场景：用户列表、文章列表等
const { data: users } = useFetch('/api/users')
// 组件一挂载就开始请求数据
```

### 策略 2: 完全手动控制
```typescript
// ✅ 适用场景：搜索、表单提交后的数据获取
const { data, refetch } = useFetch('/api/search', { immediate: false })

const handleSearch = () => {
  refetch() // 只有调用时才执行
}
```

### 策略 3: 条件触发
```typescript
// ✅ 适用场景：根据用户权限或状态决定是否加载数据
const [hasPermission, setHasPermission] = useState(false)
const { data } = useFetch('/api/sensitive-data', { 
  immediate: hasPermission,
  deps: [hasPermission] 
})
// 只有当 hasPermission 为 true 时才请求数据
```

### 策略 4: 依赖变化触发
```typescript
// ✅ 适用场景：详情页面，根据 ID 获取不同数据
const { id } = useParams()
const { data: userDetail } = useFetch(`/api/users/${id}`, { 
  deps: [id] 
})
// URL 中的 id 变化时，自动请求新的用户详情
```

## 🔧 与直接 API 调用的对比

| 场景 | Hook 方式 | 直接调用方式 | 推荐 |
|------|-----------|--------------|------|
| 页面加载时获取数据 | `useFetch('/api/data')` | ❌ 需要手写 useEffect | ✅ Hook |
| 按钮点击后执行 | `refetch()` 或 `immediate: false` | `apiClient.post()` | ✅ 直接调用 |
| 表单提交 | ❌ 复杂 | `apiClient.post(data)` | ✅ 直接调用 |
| 搜索功能 | `useSearchFetch()` | ❌ 需要手写防抖 | ✅ Hook |
| 分页数据 | `usePaginatedFetch()` | ❌ 需要手写状态管理 | ✅ Hook |
| 增删改操作 | ❌ 不适合 | `apiClient.delete()` | ✅ 直接调用 |

## 🚀 最佳实践

### 1. 数据获取 + 操作的混合模式
```typescript
function UserManagement() {
  // Hook 获取列表数据
  const { data: users, refetch } = useFetch('/api/users')
  
  // 直接调用处理操作
  const handleCreate = async (userData) => {
    await apiClient.post('/api/users', userData)
    refetch() // 操作后刷新数据
  }
  
  const handleDelete = async (id) => {
    await apiClient.delete(`/api/users/${id}`)
    refetch()
  }
}
```

### 2. 错误处理
```typescript
// Hook 方式 - 自动处理
const { data, error } = useFetch('/api/users', {
  onError: (error) => {
    toast.error(`加载失败: ${error}`)
  }
})

// 直接调用方式 - 手动处理
const handleSubmit = async () => {
  try {
    await apiClient.post('/api/users', data)
    toast.success('创建成功')
  } catch (error) {
    toast.error(`创建失败: ${handleApiError(error)}`)
  }
}
```
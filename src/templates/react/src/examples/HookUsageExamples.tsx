/**
 * Hook 使用示例
 * 展示不同场景下的 API Hook 使用方式
 */

import { useState } from 'react'
import { useFetch, usePaginatedFetch, useSearchFetch } from '@/hooks/useFetch'
import { apiClient, handleApiError } from '@/lib/api'
import Loading from '@/components/Loading'

// 示例 1: 页面加载时自动获取数据
function UserList() {
  // ✅ immediate=true (默认)，组件挂载时立即执行
  const { data: users, isLoading, error, refetch } = useFetch<User[]>('/api/users')

  if (isLoading) return <Loading text="加载用户列表..." />
  if (error) return <div className="text-error-500">错误: {error}</div>

  return (
    <div>
      <button onClick={refetch} className="btn-primary mb-4">
        刷新列表
      </button>
      {users?.map(user => (
        <div key={user.id} className="card mb-2">
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  )
}

// 示例 2: 手动触发的数据获取
function ManualDataFetch() {
  const [userId, setUserId] = useState<string>('')

  // ✅ immediate=false，不会自动执行
  const { data: user, isLoading, error, refetch } = useFetch<User>(
    `/api/users/${userId}`,
    {
      immediate: false,  // 关键：不自动执行
      deps: [userId]     // 当 userId 变化时，如果调用 refetch 会使用新的 userId
    }
  )

  const handleFetchUser = () => {
    if (userId) {
      refetch() // 手动触发请求
    }
  }

  return (
    <div>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="输入用户ID"
        className="input-base mr-2"
      />
      <button onClick={handleFetchUser} className="btn-primary">
        {isLoading ? '查询中...' : '查询用户'}
      </button>

      {error && <div className="text-error-500 mt-2">错误: {error}</div>}
      {user && (
        <div className="card mt-4">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  )
}

// 示例 3: 条件触发的数据获取
function ConditionalFetch() {
  const [shouldFetch, setShouldFetch] = useState(false)

  // ✅ 根据条件决定是否获取数据
  const { data, isLoading, error } = useFetch<any[]>('/api/data', {
    immediate: shouldFetch,  // 根据状态决定是否立即执行
    deps: [shouldFetch]      // shouldFetch 变化时重新执行
  })

  return (
    <div>
      <button
        onClick={() => setShouldFetch(!shouldFetch)}
        className="btn-primary"
      >
        {shouldFetch ? '停止获取' : '开始获取数据'}
      </button>

      {isLoading && <Loading />}
      {error && <div>错误: {error}</div>}
      {data && <div>数据条数: {data.length}</div>}
    </div>
  )
}

// 示例 4: 搜索功能
function SearchExample() {
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ 自动防抖搜索
  const { data: searchResults, isLoading } = useSearchFetch<Product[]>(
    '/api/products/search',
    searchTerm,
    {
      debounceMs: 500,    // 500ms 防抖
      minLength: 2        // 最少2个字符才搜索
    }
  )

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索产品..."
        className="input-base"
      />

      {isLoading && <div className="text-sm text-gray-500">搜索中...</div>}

      <div className="mt-4">
        {searchResults?.map(product => (
          <div key={product.id} className="card mb-2">
            {product.name} - ¥{product.price}
          </div>
        ))}
      </div>
    </div>
  )
}

// 示例 5: 分页数据
function PaginatedExample() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = usePaginatedFetch<Product>(
    '/api/products',
    {
      page,
      pageSize: 10,
      deps: [page]  // 页码变化时重新获取
    }
  )

  return (
    <div>
      {isLoading && <Loading />}
      {error && <div>错误: {error}</div>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {data.data.map(product => (
              <div key={product.id} className="card">
                {product.name}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline"
            >
              上一页
            </button>

            <span>第 {page} 页，共 {data.pagination.totalPages} 页</span>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.pagination.totalPages}
              className="btn-outline"
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// 示例 6: 混合使用（Hook + 直接调用）
function MixedUsageExample() {
  // Hook 获取列表数据
  const { data: users, isLoading, refetch } = useFetch<User[]>('/api/users')

  // 直接调用处理增删改操作
  const handleCreateUser = async (userData: any) => {
    try {
      await apiClient.post('/api/users', userData)
      // 创建成功后刷新列表
      refetch()
      alert('创建成功！')
    } catch (error) {
      alert('创建失败：' + handleApiError(error))
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiClient.delete(`/api/users/${userId}`)
      // 删除成功后刷新列表
      refetch()
    } catch (error) {
      alert('删除失败：' + handleApiError(error))
    }
  }

  return (
    <div>
      <button
        onClick={() => handleCreateUser({ name: '新用户', email: 'new@example.com' })}
        className="btn-primary mb-4"
      >
        创建用户
      </button>

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {users?.map(user => (
            <div key={user.id} className="card mb-2 flex justify-between items-center">
              <span>{user.name}</span>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="btn-outline text-error-600"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 类型定义
interface User {
  id: string
  name: string
  email: string
}

interface Product {
  id: string
  name: string
  price: number
}

export {
  UserList,
  ManualDataFetch,
  ConditionalFetch,
  SearchExample,
  PaginatedExample,
  MixedUsageExample
}
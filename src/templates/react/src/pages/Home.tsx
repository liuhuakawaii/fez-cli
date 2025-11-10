import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import { request } from '@/services'
import { useToast } from '@/hooks/useToast'
import {
  useAuthStore,
  useCartStore,
  useCartItems,
  useCartTotalPrice,
  useCartTotalQuantity,
  useTodoStore,
  useThemeStore,
} from '@/store'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError, showWarning, showInfo } = useToast()

  // ==================== Zustand Store 使用示例 ====================

  // 1. 用户认证 Store - 基本 Hook 使用
  const { user, isAuthenticated, isLoading: authLoading, login, logout, error: authError } = useAuthStore()

  // 2. 购物车 Store - 选择器优化使用（只订阅需要的状态）
  const cartItems = useCartItems() // 只订阅 items，避免不必要的重渲染
  const cartTotal = useCartTotalPrice() // 只订阅总价计算
  const cartQuantity = useCartTotalQuantity() // 只订阅总数量
  const { addItem, removeItem, clearCart, updateQuantity } = useCartStore()

  // 3. 待办事项 Store - 完整状态使用
  const { filter, addTodo, toggleTodo, deleteTodo, setFilter, getFilteredTodos, getStats } = useTodoStore()
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const filteredTodos = getFilteredTodos()
  const stats = getStats()

  // 4. 主题切换 Store
  const { theme, setTheme, initTheme } = useThemeStore()

  // 初始化主题
  useEffect(() => {
    initTheme()
  }, [initTheme])

  // 测试 API 调用 - 成功场景
  const handleTestSuccessApi = async () => {
    setIsLoading(true)
    try {
      // 使用 JSONPlaceholder 作为测试 API
      const data = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        showErrorTip: false, // 禁用自动提示，手动处理
      })
      showSuccess(`API 调用成功！获取到数据：${JSON.stringify(data).substring(0, 50)}...`)
      console.log('API 响应:', data)
    } catch (error) {
      showError('API 调用失败，请检查网络连接')
      console.error('API 错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 测试 API 调用 - 失败场景（404）
  const handleTestErrorApi = async () => {
    setIsLoading(true)
    try {
      await request.get('https://jsonplaceholder.typicode.com/posts/99999', {
        showErrorTip: false, // 禁用自动提示，手动处理
      })
    } catch (error) {
      showError('API 调用失败：资源不存在 (404)')
      console.error('API 错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 测试 API 调用 - 自动错误提示
  const handleTestAutoErrorTip = async () => {
    setIsLoading(true)
    try {
      // 这个请求会失败，并自动显示错误提示
      await request.get('https://jsonplaceholder.typicode.com/invalid-endpoint')
    } catch (error) {
      // 错误提示已自动显示
      console.error('API 错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 测试 Toast - Success
  const handleTestSuccessToast = () => {
    showSuccess('操作成功！这是一条成功提示消息。')
  }

  // 测试 Toast - Error
  const handleTestErrorToast = () => {
    showError('操作失败！这是一条错误提示消息。')
  }

  // 测试 Toast - Warning
  const handleTestWarningToast = () => {
    showWarning('请注意！这是一条警告提示消息。')
  }

  // 测试 Toast - Info
  const handleTestInfoToast = () => {
    showInfo('提示信息：这是一条信息提示消息。')
  }

  // ==================== 业务操作处理函数 ====================

  // 用户认证操作
  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123')
      showSuccess('登录成功！')
    } catch (error: any) {
      showError(error.message || '登录失败')
    }
  }

  const handleLogout = () => {
    logout()
    showInfo('已退出登录')
  }

  // 购物车操作
  const mockProducts = [
    { id: '1', name: 'MacBook Pro', price: 12999, image: '💻', stock: 10 },
    { id: '2', name: 'iPhone 15', price: 6999, image: '📱', stock: 20 },
    { id: '3', name: 'AirPods Pro', price: 1899, image: '🎧', stock: 30 },
  ]

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addItem(product, 1)
    showSuccess(`已将 ${product.name} 添加到购物车`)
  }

  const handleRemoveFromCart = (itemId: string, productName: string) => {
    removeItem(itemId)
    showInfo(`已从购物车移除 ${productName}`)
  }

  const handleClearCart = () => {
    clearCart()
    showWarning('购物车已清空')
  }

  // 待办事项操作
  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) {
      showWarning('请输入待办事项')
      return
    }
    addTodo(newTodoTitle)
    setNewTodoTitle('')
    showSuccess('待办事项已添加')
  }

  const handleToggleTodo = (id: string, title: string, completed: boolean) => {
    toggleTodo(id)
    showInfo(`${completed ? '取消完成' : '完成'}：${title}`)
  }

  const handleDeleteTodo = (id: string, title: string) => {
    deleteTodo(id)
    showWarning(`已删除：${title}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-gray-900">liuhuakawaii-playground</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              A modern React application built with TypeScript, Vite, and Tailwind CSS.
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Featuring Axios with exponential backoff retry and flexible error handling.
              </span>
            </p>
          </div>

          {/* API 测试区域 */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">API 调用测试</h2>
              <p className="text-gray-600 mb-6">
                测试基于 Axios 的请求客户端，包括成功、失败和自动错误提示场景。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={handleTestSuccessApi}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? '请求中...' : '测试成功 API'}
                </Button>
                <Button
                  onClick={handleTestErrorApi}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  {isLoading ? '请求中...' : '测试失败 API'}
                </Button>
                <Button
                  onClick={handleTestAutoErrorTip}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? '请求中...' : '测试自动错误提示'}
                </Button>
              </div>
            </div>
          </div>

          {/* Toast 测试区域 */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Toast 提示测试</h2>
              <p className="text-gray-600 mb-6">
                测试不同类型的 Toast 提示消息（成功、错误、警告、信息）。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button
                  onClick={handleTestSuccessToast}
                  className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  成功提示
                </Button>
                <Button
                  onClick={handleTestErrorToast}
                  className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  错误提示
                </Button>
                <Button
                  onClick={handleTestWarningToast}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                >
                  警告提示
                </Button>
                <Button
                  onClick={handleTestInfoToast}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                >
                  信息提示
                </Button>
              </div>
            </div>
          </div>

          {/* Zustand 真实业务场景演示 */}

          {/* 1. 用户认证 Store */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">1. 用户认证 Store</h2>
              <p className="text-gray-600 mb-6">
                真实场景：管理用户登录状态、用户信息。展示异步操作和状态持久化。
              </p>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    {user?.avatar && (
                      <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <p className="text-xs text-gray-500">角色：{user?.role}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    退出登录
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">当前未登录</p>
                    {authError && (
                      <p className="text-sm text-red-600 mb-2">错误：{authError}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleLogin}
                    disabled={authLoading}
                    className="w-full"
                  >
                    {authLoading ? '登录中...' : '模拟登录'}
                  </Button>
                </div>
              )}

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>使用方式：</strong>Hook 形式 <code className="bg-gray-200 px-1 rounded">useAuthStore()</code>。
                  支持异步操作（登录），状态自动持久化。
                </p>
              </div>
            </div>
          </div>

          {/* 2. 购物车 Store */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">2. 购物车 Store</h2>
              <p className="text-gray-600 mb-6">
                真实场景：电商购物车管理。展示选择器优化，避免不必要的重渲染。
              </p>

              {/* 商品列表 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">商品列表</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl mb-2">{product.image}</div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">¥{product.price.toLocaleString()}</p>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full mt-2 text-xs"
                        variant="outline"
                      >
                        加入购物车
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 购物车内容 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">购物车</h3>
                  <div className="text-sm text-gray-600">
                    共 {cartQuantity} 件商品 · 总计 ¥{cartTotal.toLocaleString()}
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">购物车为空</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{item.productImage}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-500">¥{item.price.toLocaleString()} × {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.id, item.productName)}
                            className="ml-2 text-red-600 hover:text-red-700 text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cartItems.length > 0 && (
                  <Button
                    onClick={handleClearCart}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    清空购物车
                  </Button>
                )}

                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">
                    💡 <strong>使用方式：</strong>选择器优化 <code className="bg-gray-200 px-1 rounded">useCartItems()</code>。
                    只订阅需要的状态，避免不必要的重渲染。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 待办事项 Store */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">3. 待办事项 Store</h2>
              <p className="text-gray-600 mb-6">
                真实场景：任务管理。展示列表状态管理、过滤和批量操作。
              </p>

              {/* 添加待办 */}
              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="输入待办事项..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleAddTodo}>添加</Button>
              </div>

              {/* 过滤和统计 */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {(['all', 'active', 'completed'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${filter === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  总计 {stats.total} · 进行中 {stats.active} · 已完成 {stats.completed}
                </div>
              </div>

              {/* 待办列表 */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredTodos.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">暂无待办事项</p>
                ) : (
                  filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id, todo.title, todo.completed)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}
                        >
                          {todo.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTodo(todo.id, todo.title)}
                        className="text-red-600 hover:text-red-700 text-sm ml-2"
                      >
                        删除
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>使用方式：</strong>完整状态使用 <code className="bg-gray-200 px-1 rounded">useTodoStore()</code>。
                  支持过滤、统计等复杂操作。
                </p>
              </div>
            </div>
          </div>

          {/* 4. 主题切换 Store */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">4. 主题切换 Store</h2>
              <p className="text-gray-600 mb-6">
                真实场景：应用主题管理。展示简单的状态切换和副作用处理。
              </p>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">当前主题</p>
                  <p className="text-sm text-gray-600">
                    {theme === 'system' ? '跟随系统' : theme === 'light' ? '亮色模式' : '暗色模式'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${theme === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {t === 'light' ? '☀️ 亮色' : t === 'dark' ? '🌙 暗色' : '⚙️ 系统'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>使用方式：</strong>简单状态切换 <code className="bg-gray-200 px-1 rounded">useThemeStore()</code>。
                  自动应用主题到 DOM，支持系统主题检测。
                </p>
              </div>
            </div>
          </div>

          {/* Zustand 使用方式总结 */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Zustand 使用方式总结</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Hook 形式（最常用）</h3>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    const {'{'} user, login {'}'} = useAuthStore()
                  </code>
                  <p className="text-xs text-gray-600 mt-2">在组件中使用，自动订阅状态变化</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">2. 选择器优化</h3>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    const items = useCartItems()
                  </code>
                  <p className="text-xs text-gray-600 mt-2">只订阅需要的状态，避免不必要的重渲染</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">3. 直接访问（非组件）</h3>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    if (authStore().isAuthenticated) {'{...}'}
                  </code>
                  <p className="text-xs text-gray-600 mt-2">在 API 拦截器、工具函数等非组件代码中使用</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">4. 异步操作</h3>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    await login(email, password)
                  </code>
                  <p className="text-xs text-gray-600 mt-2">Store 中直接定义异步方法，支持 async/await</p>
                </div>
              </div>
            </div>
          </div>

          {/* 特性卡片 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-gray-600">
                Built with TypeScript for better development experience and type safety.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vite</h3>
              <p className="text-gray-600">
                Lightning fast build tool with hot module replacement.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
              <p className="text-gray-600">
                Utility-first CSS framework for rapid UI development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
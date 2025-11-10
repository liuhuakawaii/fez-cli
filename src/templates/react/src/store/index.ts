/**
 * Store 统一导出
 * 集中管理所有 Store，便于统一导入和使用
 * 
 * Zustand 使用方式说明：
 * 
 * 1. Hook 形式（最常用，在组件中使用）
 *    const { user, login } = useAuthStore()
 * 
 * 2. 选择器优化（避免不必要的重渲染）
 *    const items = useCartItems() // 只订阅 items，其他状态变化不会触发重渲染
 * 
 * 3. 直接访问（在非组件代码中使用，如 API 拦截器、工具函数）
 *    import { authStore } from '@/store'
 *    if (authStore().isAuthenticated) { ... }
 * 
 * 4. 异步操作（thunk 模式）
 *    await login(email, password) // Store 中的异步方法
 */

// 导出所有 slices
export { useAuthStore, authStore } from './slices/auth'
export { 
  useCartStore, 
  useCartItems, 
  useCartTotalPrice, 
  useCartTotalQuantity 
} from './slices/cart'
export { useTodoStore } from './slices/todo'
export { useThemeStore } from './slices/theme'

// 导出类型
export type { 
  RootState, 
  AuthState, 
  CartState, 
  CartItem,
  TodoState, 
  Todo,
  ThemeState 
} from './types'

/**
 * 使用示例：
 * 
 * // 1. 基本使用（Hook 形式）
 * import { useAuthStore } from '@/store'
 * 
 * function LoginComponent() {
 *   const { user, login, isLoading } = useAuthStore()
 *   // ...
 * }
 * 
 * // 2. 选择器优化（只订阅需要的状态）
 * import { useCartItems, useCartTotalPrice } from '@/store'
 * 
 * function CartSummary() {
 *   const items = useCartItems() // 只订阅 items
 *   const total = useCartTotalPrice() // 只订阅总价计算
 *   // ...
 * }
 * 
 * // 3. 非组件中使用（直接访问）
 * import { authStore } from '@/store'
 * 
 * // 在 API 拦截器中
 * if (authStore().isAuthenticated) {
 *   headers.Authorization = `Bearer ${authStore().user?.token}`
 * }
 */

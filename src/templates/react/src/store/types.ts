/**
 * Store 类型定义
 * 集中管理所有 Store 的类型
 */

import type { User, UserRole } from '@/types/entities/user'
import type { Theme } from '@/types/common'

/**
 * Store 状态根类型
 * 用于类型推断和组合所有 slices
 */
export interface RootState {
  auth: AuthState
  cart: CartState
  todo: TodoState
  theme: ThemeState
}

// ==================== 用户认证 Store ====================

/**
 * 用户认证状态接口
 */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; user: User }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  hasRole: (role: UserRole) => boolean
  checkAuth: () => boolean
  clearError: () => void
}

// ==================== 购物车 Store ====================

/**
 * 购物车商品项
 */
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  addedAt: string
}

/**
 * 购物车状态接口
 */
export interface CartState {
  items: CartItem[]
  addItem: (product: { id: string; name: string; price: number; image: string; stock: number }, quantity?: number) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalQuantity: () => number
  isItemInCart: (productId: string) => boolean
}

// ==================== 待办事项 Store ====================

/**
 * 待办事项
 */
export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 待办事项状态接口
 */
export interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo: (title: string) => Todo
  toggleTodo: (id: string) => void
  updateTodo: (id: string, title: string) => void
  deleteTodo: (id: string) => void
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  getFilteredTodos: () => Todo[]
  completeAll: () => void
  clearCompleted: () => void
  getStats: () => { total: number; active: number; completed: number }
}

// ==================== 主题 Store ====================

/**
 * 主题状态接口
 */
export interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  applyTheme: (theme: Theme) => void
  getActualTheme: () => 'light' | 'dark'
  initTheme: () => void
}

/**
 * 用户认证 Store
 * 真实业务场景：管理用户登录状态、用户信息、权限等
 * 
 * 展示：
 * - 异步操作（登录/登出）
 * - 状态持久化（保持登录状态）
 * - 直接访问 store（非组件中使用）
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthState } from '../types'
import type { User, UserRole } from '@/types/entities/user'

/**
 * 用户认证 Store
 * 
 * 功能：
 * - 登录/登出
 * - 用户信息管理
 * - 权限检查
 * - 自动持久化登录状态
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 状态
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录（异步操作）
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // 模拟 API 调用
          await new Promise((resolve) => setTimeout(resolve, 1000))
          
          // 模拟登录成功，返回用户信息
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            role: email.includes('admin') ? 'admin' : 'user',
            status: 'active',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return { success: true, user: mockUser }
        } catch (error: any) {
          const errorMessage = error.message || '登录失败，请检查邮箱和密码'
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      // 登出
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // 更新用户信息
      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, ...userData, updatedAt: new Date().toISOString() },
          })
        }
      },

      // 检查权限
      hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.role === role
      },

      // 检查是否已登录（用于非组件代码中直接访问）
      checkAuth: () => {
        return get().isAuthenticated
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化用户信息和认证状态，不持久化 loading 和 error
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/**
 * 在非组件代码中直接访问 store（如 API 拦截器、工具函数等）
 * 这是 zustand 的另一种使用方式，不需要 hook
 */
export const authStore = useAuthStore.getState


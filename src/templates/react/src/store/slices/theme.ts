/**
 * 主题切换 Store
 * 真实业务场景：应用主题管理（亮色/暗色模式）
 * 
 * 展示：
 * - 简单的状态切换
 * - 副作用处理（更新 DOM class）
 * - 系统主题检测
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ThemeState } from '../types'
import type { Theme } from '@/types/common'

/**
 * 主题 Store
 * 
 * 功能：
 * - 切换主题（light/dark/system）
 * - 自动应用主题到 DOM
 * - 检测系统主题偏好
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // 状态
      theme: 'system' as Theme,

      // 设置主题
      setTheme: (theme: Theme) => {
        set({ theme })
        get().applyTheme(theme)
      },

      // 切换主题（在 light 和 dark 之间切换）
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },

      // 应用主题到 DOM
      applyTheme: (theme: Theme) => {
        const root = document.documentElement
        const actualTheme = theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme

        // 移除旧的主题类
        root.classList.remove('light', 'dark')
        // 添加新的主题类
        root.classList.add(actualTheme)
      },

      // 获取实际应用的主题（考虑 system 模式）
      getActualTheme: (): 'light' | 'dark' => {
        const { theme } = get()
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
      },

      // 初始化主题（在应用启动时调用）
      initTheme: () => {
        const { theme } = get()
        get().applyTheme(theme)

        // 监听系统主题变化（仅在 system 模式下）
        if (theme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleChange = () => {
            if (get().theme === 'system') {
              get().applyTheme('system')
            }
          }
          mediaQuery.addEventListener('change', handleChange)
          // 返回清理函数（虽然 zustand 不直接支持，但可以在组件中使用）
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)


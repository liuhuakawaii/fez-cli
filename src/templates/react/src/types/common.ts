/**
 * 通用类型定义
 * 定义项目中通用的数据结构和工具类型
 */

// 基础实体接口
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// 加载状态接口
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// 异步操作状态
export interface AsyncState<T> extends LoadingState {
  data: T | null
}

// 表单状态接口
export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 尺寸类型
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 颜色变体类型
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'

// 工具类型：使所有属性可选
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 工具类型：使所有属性必需
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
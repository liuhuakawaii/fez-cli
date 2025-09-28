/**
 * 类型定义入口文件
 * 统一导出所有类型定义，方便其他模块引用
 * 
 * 注意：这里保留了原有的类型定义以保持向后兼容
 * 建议逐步迁移到新的类型定义文件中
 */

export * from './api'
export * from './common'

// 向后兼容的类型定义（建议逐步迁移）
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// 这些类型已在 api.ts 中重新定义，这里保留是为了向后兼容
export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
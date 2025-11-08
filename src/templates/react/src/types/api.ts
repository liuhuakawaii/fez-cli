/**
 * API 相关的类型定义
 * 定义所有与后端交互相关的数据结构
 */

// 通用 API 响应结构
export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  code: number
}

// 分页响应结构
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// API 错误响应
export interface ApiError {
  message: string
  code: number
  details?: Record<string, any>
}

// 请求状态枚举
export enum RequestStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求配置接口（兼容旧的fetch配置）
export interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
}

// Axios 请求配置接口（新）
export interface AxiosRequestConfig {
  // 是否显示错误提示（默认true）
  showErrorTip?: boolean
  // 自定义错误提示消息
  errorTip?: string
  // 是否显示成功提示
  showSuccessTip?: boolean
  // 自定义成功提示消息
  successTip?: string
  // 重试次数（默认使用全局配置）
  retries?: number
  // 是否启用重试（默认true）
  enableRetry?: boolean
}
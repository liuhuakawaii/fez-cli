/**
 * API 客户端配置和工具
 * 提供统一的 HTTP 请求接口，包含错误处理、拦截器、重试机制等
 */

import { API_CONFIG, HTTP_STATUS, STORAGE_KEYS } from '@/constants'
import type { ApiResponse, ApiError, RequestConfig } from '@/types'

// 请求错误类
export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public data: any,
    message?: string
  ) {
    super(message || `API Error: ${status}`)
    this.name = 'ApiRequestError'
  }
}

// 网络错误类
export class NetworkError extends Error {
  constructor(message = '网络连接失败') {
    super(message)
    this.name = 'NetworkError'
  }
}

// 超时错误类
export class TimeoutError extends Error {
  constructor(message = '请求超时') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private retryAttempts: number

  constructor(
    baseURL: string = API_CONFIG.baseURL,
    timeout: number = API_CONFIG.timeout,
    retryAttempts: number = API_CONFIG.retryAttempts
  ) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
    this.retryAttempts = retryAttempts
  }

  /**
   * 请求拦截器 - 在发送请求前处理
   */
  private async requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
    // 添加认证 token
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    // 添加默认 headers
    config.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    }

    return config
  }

  /**
   * 响应拦截器 - 处理响应数据和错误
   */
  private async responseInterceptor<T>(response: Response): Promise<T> {
    // 处理不同的响应状态
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      // 清除本地认证信息
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      // 可以在这里触发重新登录逻辑
      throw new ApiRequestError(response.status, null, '登录已过期，请重新登录')
    }

    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: `HTTP ${response.status} Error` }
      }
      
      throw new ApiRequestError(
        response.status,
        errorData,
        errorData.message || `请求失败 (${response.status})`
      )
    }

    try {
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('响应数据格式错误')
    }
  }

  /**
   * 创建带超时的 fetch 请求
   */
  private createTimeoutFetch(timeout: number) {
    return (url: string, config: RequestConfig) => {
      return Promise.race([
        fetch(url, config),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new TimeoutError()), timeout)
        })
      ])
    }
  }

  /**
   * 重试机制
   */
  private async withRetry<T>(
    requestFn: () => Promise<T>,
    attempts: number = this.retryAttempts
  ): Promise<T> {
    let lastError: Error

    for (let i = 0; i <= attempts; i++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error as Error
        
        // 对于某些错误类型不进行重试
        if (
          error instanceof ApiRequestError &&
          [HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN].includes(error.status)
        ) {
          throw error
        }

        // 最后一次尝试失败
        if (i === attempts) {
          break
        }

        // 等待一段时间后重试 (指数退避)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }

    throw lastError!
  }

  /**
   * 核心请求方法
   */
  async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const timeout = options.timeout || this.defaultTimeout
    const retries = options.retries !== undefined ? options.retries : this.retryAttempts

    // 应用请求拦截器
    const config = await this.requestInterceptor(options)

    const requestFn = async () => {
      const timeoutFetch = this.createTimeoutFetch(timeout)
      
      try {
        const response = await timeoutFetch(url, config)
        return await this.responseInterceptor<T>(response)
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new NetworkError()
        }
        throw error
      }
    }

    return this.withRetry(requestFn, retries)
  }

  // HTTP 方法封装
  async get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * 上传文件
   */
  async upload<T>(
    endpoint: string,
    file: File | FormData,
    options?: Omit<RequestConfig, 'body'>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    // 移除 Content-Type header，让浏览器自动设置
    const { headers, ...restOptions } = options || {}
    const uploadHeaders = { ...headers }
    delete uploadHeaders['Content-Type']

    return this.request<T>(endpoint, {
      ...restOptions,
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    })
  }

  /**
   * 取消请求的 AbortController
   */
  createAbortController(): AbortController {
    return new AbortController()
  }
}

// 默认 API 客户端实例
export const apiClient = new ApiClient()

// 便捷的错误处理函数
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiRequestError) {
    return error.message
  }
  
  if (error instanceof NetworkError) {
    return '网络连接失败，请检查网络设置'
  }
  
  if (error instanceof TimeoutError) {
    return '请求超时，请稍后重试'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return '未知错误'
}
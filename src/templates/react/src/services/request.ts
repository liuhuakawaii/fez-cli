/**
 * Axios 请求客户端封装
 * 提供统一的 HTTP 请求接口，包含错误处理、拦截器、指数回退重试机制等
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { API_CONFIG, HTTP_STATUS, STORAGE_KEYS } from '@/constants'
import type { ApiResponse } from '@/types'
import { ErrorHandler } from './errorHandler'

/**
 * 扩展的请求配置接口
 */
export interface RequestConfig extends Omit<AxiosRequestConfig, 'signal'> {
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
  // 支持 AbortSignal
  signal?: AbortSignal
}

/**
 * 重试配置
 */
interface RetryConfig {
  retries: number
  retryDelay: number
  retryCondition?: (error: AxiosError) => boolean
}

/**
 * Axios 请求客户端类
 */
class RequestClient {
  private instance: AxiosInstance
  private defaultRetries: number = API_CONFIG.retryAttempts

  constructor() {
    // 创建 axios 实例
    this.instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // 设置请求拦截器
    this.setupRequestInterceptor()
    // 设置响应拦截器
    this.setupResponseInterceptor()
  }

  /**
   * 请求拦截器
   */
  private setupRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加认证 token
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * 响应拦截器
   */
  private setupResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 如果响应数据符合 ApiResponse 结构，直接返回 data
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          return response.data.data
        }
        // 否则返回整个响应数据
        return response.data
      },
      async (error: AxiosError) => {
        // 处理401未授权错误
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          // 可以在这里触发重新登录逻辑
          const errorHandler = new ErrorHandler(error)
          errorHandler.handle()
          return Promise.reject(error)
        }

        // 处理其他错误
        const errorHandler = new ErrorHandler(error)
        const errorMessage = errorHandler.getMessage()

        // 创建增强的错误对象
        const enhancedError = {
          ...error,
          message: errorMessage,
          errorHandler,
        }

        return Promise.reject(enhancedError)
      }
    )
  }

  /**
   * 指数回退重试机制
   * @param error 错误对象
   * @param config 请求配置
   * @returns 是否应该重试
   */
  private shouldRetry(error: AxiosError, config: RequestConfig): boolean {
    // 如果禁用了重试，直接返回false
    if (config.enableRetry === false) {
      return false
    }

    // 网络错误或超时错误应该重试
    if (!error.response) {
      return true
    }

    // 5xx 服务器错误应该重试
    const status = error.response.status
    if (status >= 500 && status < 600) {
      return true
    }

    // 429 请求过多应该重试
    if (status === 429) {
      return true
    }

    // 其他错误不重试
    return false
  }

  /**
   * 计算重试延迟时间（指数回退）
   * @param retryCount 当前重试次数
   * @returns 延迟时间（毫秒）
   */
  private getRetryDelay(retryCount: number): number {
    // 指数回退：2^retryCount * 1000ms
    // 最大延迟30秒
    const baseDelay = 1000
    const maxDelay = 30000
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay)
    
    // 添加随机抖动，避免雷群效应
    const jitter = Math.random() * 0.3 * delay
    return Math.floor(delay + jitter)
  }

  /**
   * 带重试的请求方法
   */
  private async requestWithRetry<T>(
    config: RequestConfig,
    retryCount: number = 0
  ): Promise<T> {
    try {
      const response = await this.instance.request<T>(config)
      return response as T
    } catch (error) {
      const axiosError = error as AxiosError & { errorHandler?: ErrorHandler }
      const maxRetries = config.retries ?? this.defaultRetries

      // 判断是否应该重试
      if (retryCount < maxRetries && this.shouldRetry(axiosError, config)) {
        // 计算延迟时间
        const delay = this.getRetryDelay(retryCount)
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay))
        
        // 递归重试
        return this.requestWithRetry<T>(config, retryCount + 1)
      }

      // 不再重试，抛出错误
      throw axiosError
    }
  }

  /**
   * 核心请求方法
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      const data = await this.requestWithRetry<T>(config)
      return data
    } catch (error) {
      const axiosError = error as AxiosError & { errorHandler?: ErrorHandler }
      const requestConfig = axiosError.config as RequestConfig | undefined

      // 处理错误提示
      if (requestConfig?.showErrorTip !== false) {
        const errorHandler = axiosError.errorHandler || new ErrorHandler(axiosError)
        const errorMessage = requestConfig?.errorTip || errorHandler.getMessage()
        errorHandler.showTip(errorMessage)
      }

      throw error
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  /**
   * 文件上传
   */
  async upload<T = any>(
    url: string,
    file: File | FormData,
    config?: RequestConfig,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  }

  /**
   * 获取 axios 实例（用于特殊场景）
   */
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// 导出单例实例
export const request = new RequestClient()

// 导出便捷方法
export const { get, post, put, patch, delete: del } = request


/**
 * API 错误处理模块
 * 统一处理各种API错误，提供错误消息和提示功能
 */

import { AxiosError } from 'axios'
import { HTTP_STATUS } from '@/constants'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 错误消息映射
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: '网络连接失败，请检查网络设置',
  [ErrorType.TIMEOUT]: '请求超时，请稍后重试',
  [ErrorType.UNAUTHORIZED]: '登录已过期，请重新登录',
  [ErrorType.FORBIDDEN]: '没有权限访问该资源',
  [ErrorType.NOT_FOUND]: '请求的资源不存在',
  [ErrorType.SERVER_ERROR]: '服务器错误，请稍后重试',
  [ErrorType.VALIDATION_ERROR]: '请求参数验证失败',
  [ErrorType.UNKNOWN]: '未知错误，请稍后重试',
}

/**
 * HTTP 状态码到错误类型的映射
 */
const STATUS_TO_ERROR_TYPE: Record<number, ErrorType> = {
  [HTTP_STATUS.UNAUTHORIZED]: ErrorType.UNAUTHORIZED,
  [HTTP_STATUS.FORBIDDEN]: ErrorType.FORBIDDEN,
  [HTTP_STATUS.NOT_FOUND]: ErrorType.NOT_FOUND,
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ErrorType.SERVER_ERROR,
}

/**
 * 错误处理类
 */
export class ErrorHandler {
  private error: AxiosError | Error
  private errorType: ErrorType
  private errorMessage: string

  constructor(error: AxiosError | Error) {
    this.error = error
    this.errorType = this.determineErrorType()
    this.errorMessage = this.extractErrorMessage()
  }

  /**
   * 确定错误类型
   */
  private determineErrorType(): ErrorType {
    if (this.error instanceof AxiosError) {
      // 网络错误（无响应）
      if (!this.error.response) {
        if (this.error.code === 'ECONNABORTED' || this.error.message.includes('timeout')) {
          return ErrorType.TIMEOUT
        }
        if (this.error.code === 'ERR_NETWORK' || this.error.message.includes('Network Error')) {
          return ErrorType.NETWORK
        }
        return ErrorType.NETWORK
      }

      // HTTP 状态码错误
      const status = this.error.response.status
      if (status in STATUS_TO_ERROR_TYPE) {
        return STATUS_TO_ERROR_TYPE[status]
      }

      // 4xx 客户端错误
      if (status >= 400 && status < 500) {
        return ErrorType.VALIDATION_ERROR
      }

      // 5xx 服务器错误
      if (status >= 500) {
        return ErrorType.SERVER_ERROR
      }
    }

    return ErrorType.UNKNOWN
  }

  /**
   * 提取错误消息
   */
  private extractErrorMessage(): string {
    if (this.error instanceof AxiosError) {
      // 优先使用响应中的错误消息
      if (this.error.response?.data) {
        const data = this.error.response.data as any
        
        // 尝试多种常见的错误消息格式
        if (typeof data === 'string') {
          return data
        }
        
        if (typeof data === 'object') {
          // 格式1: { message: "..." }
          if (data.message) {
            return data.message
          }
          
          // 格式2: { error: "..." }
          if (data.error) {
            return data.error
          }
          
          // 格式3: { msg: "..." }
          if (data.msg) {
            return data.msg
          }
          
          // 格式4: { errorMessage: "..." }
          if (data.errorMessage) {
            return data.errorMessage
          }
          
          // 格式5: { errors: [...] } (验证错误)
          if (data.errors && Array.isArray(data.errors)) {
            return data.errors.join(', ')
          }
        }
      }

      // 使用错误类型对应的默认消息
      return ERROR_MESSAGES[this.errorType]
    }

    // 普通 Error 对象
    if (this.error instanceof Error) {
      return this.error.message || ERROR_MESSAGES[ErrorType.UNKNOWN]
    }

    return ERROR_MESSAGES[ErrorType.UNKNOWN]
  }

  /**
   * 获取错误类型
   */
  getType(): ErrorType {
    return this.errorType
  }

  /**
   * 获取错误消息
   */
  getMessage(): string {
    return this.errorMessage
  }

  /**
   * 获取原始错误对象
   */
  getError(): AxiosError | Error {
    return this.error
  }

  /**
   * 获取HTTP状态码（如果是AxiosError）
   */
  getStatus(): number | null {
    if (this.error instanceof AxiosError && this.error.response) {
      return this.error.response.status
    }
    return null
  }

  /**
   * 获取错误响应数据（如果是AxiosError）
   */
  getResponseData(): any {
    if (this.error instanceof AxiosError && this.error.response) {
      return this.error.response.data
    }
    return null
  }

  /**
   * 显示错误提示
   */
  showTip(customMessage?: string): void {
    const message = customMessage || this.errorMessage
    // 使用动态导入避免循环依赖
    import('@/hooks/useToast').then(({ showError }) => {
      showError(message)
    })
  }

  /**
   * 处理错误（显示提示并返回消息）
   */
  handle(customMessage?: string): string {
    const message = customMessage || this.errorMessage
    this.showTip(message)
    return message
  }

  /**
   * 判断是否为特定错误类型
   */
  isType(type: ErrorType): boolean {
    return this.errorType === type
  }

  /**
   * 判断是否为网络错误
   */
  isNetworkError(): boolean {
    return this.errorType === ErrorType.NETWORK
  }

  /**
   * 判断是否为超时错误
   */
  isTimeoutError(): boolean {
    return this.errorType === ErrorType.TIMEOUT
  }

  /**
   * 判断是否为认证错误
   */
  isUnauthorizedError(): boolean {
    return this.errorType === ErrorType.UNAUTHORIZED
  }
}

/**
 * 便捷的错误处理函数
 * @param error 错误对象
 * @returns 错误消息字符串
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError || error instanceof Error) {
    const handler = new ErrorHandler(error)
    return handler.getMessage()
  }
  return ERROR_MESSAGES[ErrorType.UNKNOWN]
}

/**
 * 处理错误并显示提示
 * @param error 错误对象
 * @param customMessage 自定义错误消息
 * @returns 错误消息字符串
 */
export async function handleApiErrorWithTip(error: unknown, customMessage?: string): Promise<string> {
  if (error instanceof AxiosError || error instanceof Error) {
    const handler = new ErrorHandler(error)
    return handler.handle(customMessage)
  }
  const message = ERROR_MESSAGES[ErrorType.UNKNOWN]
  const { showError } = await import('@/hooks/useToast')
  showError(message)
  return message
}


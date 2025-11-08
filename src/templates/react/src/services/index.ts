/**
 * Services 模块统一导出
 * 方便业务组件导入使用
 */

export { request, get, post, put, patch, del } from './request'
export type { RequestConfig } from './request'

export {
  ErrorHandler,
  ErrorType,
  handleApiError,
  handleApiErrorWithTip,
} from './errorHandler'


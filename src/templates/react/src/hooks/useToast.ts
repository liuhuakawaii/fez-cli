/**
 * Toast 提示 Hook
 * 提供便捷的提示消息方法
 */

import type { ToastType, ToastItem } from '@/components/Toast'

/**
 * 显示 Toast 提示
 * @param message 提示消息
 * @param type 提示类型
 * @param duration 持续时间（毫秒），默认3000ms
 */
export function showTip(
  message: string,
  type: ToastType = 'info',
  duration?: number
): void {
  const event = new CustomEvent<Omit<ToastItem, 'id'>>('show-toast', {
    detail: {
      message,
      type,
      duration,
    },
  })
  window.dispatchEvent(event)
}

/**
 * 显示成功提示
 */
export function showSuccess(message: string, duration?: number): void {
  showTip(message, 'success', duration)
}

/**
 * 显示错误提示
 */
export function showError(message: string, duration?: number): void {
  showTip(message, 'error', duration)
}

/**
 * 显示警告提示
 */
export function showWarning(message: string, duration?: number): void {
  showTip(message, 'warning', duration)
}

/**
 * 显示信息提示
 */
export function showInfo(message: string, duration?: number): void {
  showTip(message, 'info', duration)
}

/**
 * useToast Hook
 * 在组件中使用 Toast 提示
 */
export function useToast() {
  return {
    showTip,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}


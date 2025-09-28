/**
 * 加载组件
 * 提供统一的加载状态显示，支持不同尺寸和样式
 */

import { cn } from '@/utils/cn'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
  fullScreen?: boolean
}

export default function Loading({
  size = 'md',
  className,
  text,
  fullScreen = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className={cn('text-gray-600', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

// 页面级加载组件
export function PageLoading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  )
}

// 按钮内加载组件
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-white/30 border-t-white',
        size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
      )}
    />
  )
}
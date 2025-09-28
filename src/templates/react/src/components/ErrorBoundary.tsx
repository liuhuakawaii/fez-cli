/**
 * 错误边界组件
 * 捕获子组件中的 JavaScript 错误，防止整个应用崩溃
 * 提供友好的错误提示和恢复机制
 */

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染将显示错误 UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // 可以在这里记录错误到错误报告服务
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // 在生产环境中，可以发送错误到监控服务
    if (import.meta.env.PROD) {
      // 例如：sendErrorToService(error, errorInfo)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // 自定义错误 UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900 mb-2">
                出现了一些问题
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                应用遇到了意外错误，请尝试刷新页面或联系技术支持。
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-4 p-3 bg-gray-100 rounded text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    错误详情 (开发模式)
                  </summary>
                  <pre className="mt-2 text-red-600 whitespace-pre-wrap">
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  重试
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  刷新页面
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
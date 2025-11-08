import { useState } from 'react'
import Button from '@/components/Button'
import { request } from '@/services'
import { useToast } from '@/hooks/useToast'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError, showWarning, showInfo } = useToast()

  // 测试 API 调用 - 成功场景
  const handleTestSuccessApi = async () => {
    setIsLoading(true)
    try {
      // 使用 JSONPlaceholder 作为测试 API
      const data = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        showErrorTip: false, // 禁用自动提示，手动处理
      })
      showSuccess(`API 调用成功！获取到数据：${JSON.stringify(data).substring(0, 50)}...`)
      console.log('API 响应:', data)
    } catch (error) {
      showError('API 调用失败，请检查网络连接')
      console.error('API 错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 测试 API 调用 - 失败场景（404）
  const handleTestErrorApi = async () => {
    setIsLoading(true)
    try {
      await request.get('https://jsonplaceholder.typicode.com/posts/99999', {
        showErrorTip: false, // 禁用自动提示，手动处理
      })
    } catch (error) {
      showError('API 调用失败：资源不存在 (404)')
      console.error('API 错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 测试 API 调用 - 自动错误提示
  const handleTestAutoErrorTip = async () => {
    setIsLoading(true)
    try {
      // 这个请求会失败，并自动显示错误提示
      await request.get('https://jsonplaceholder.typicode.com/invalid-endpoint')
    } catch (error) {
      // 错误提示已自动显示
      console.error('API 错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 测试 Toast - Success
  const handleTestSuccessToast = () => {
    showSuccess('操作成功！这是一条成功提示消息。')
  }

  // 测试 Toast - Error
  const handleTestErrorToast = () => {
    showError('操作失败！这是一条错误提示消息。')
  }

  // 测试 Toast - Warning
  const handleTestWarningToast = () => {
    showWarning('请注意！这是一条警告提示消息。')
  }

  // 测试 Toast - Info
  const handleTestInfoToast = () => {
    showInfo('提示信息：这是一条信息提示消息。')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-gray-900">liuhuakawaii-playground</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              A modern React application built with TypeScript, Vite, and Tailwind CSS.
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Featuring Axios with exponential backoff retry and flexible error handling.
              </span>
            </p>
          </div>

          {/* API 测试区域 */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">API 调用测试</h2>
              <p className="text-gray-600 mb-6">
                测试基于 Axios 的请求客户端，包括成功、失败和自动错误提示场景。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={handleTestSuccessApi}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? '请求中...' : '测试成功 API'}
                </Button>
                <Button
                  onClick={handleTestErrorApi}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  {isLoading ? '请求中...' : '测试失败 API'}
                </Button>
                <Button
                  onClick={handleTestAutoErrorTip}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? '请求中...' : '测试自动错误提示'}
                </Button>
              </div>
            </div>
          </div>

          {/* Toast 测试区域 */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Toast 提示测试</h2>
              <p className="text-gray-600 mb-6">
                测试不同类型的 Toast 提示消息（成功、错误、警告、信息）。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button
                  onClick={handleTestSuccessToast}
                  className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  成功提示
                </Button>
                <Button
                  onClick={handleTestErrorToast}
                  className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  错误提示
                </Button>
                <Button
                  onClick={handleTestWarningToast}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                >
                  警告提示
                </Button>
                <Button
                  onClick={handleTestInfoToast}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                >
                  信息提示
                </Button>
              </div>
            </div>
          </div>

          {/* 特性卡片 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-gray-600">
                Built with TypeScript for better development experience and type safety.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vite</h3>
              <p className="text-gray-600">
                Lightning fast build tool with hot module replacement.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
              <p className="text-gray-600">
                Utility-first CSS framework for rapid UI development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import Button from '@/components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 数字 */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
            404
          </h1>
          <div className="absolute inset-0 text-9xl font-extrabold text-gray-200 -z-10 blur-sm">
            404
          </div>
        </div>

        {/* 错误图标动画 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* 错误信息 */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          页面未找到
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          抱歉，我们找不到您要访问的页面。
        </p>
        <p className="text-lg text-gray-500 mb-10">
          页面可能已被移动、删除或暂时不可用。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button size="lg" className="min-w-[160px]">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
              返回首页
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="min-w-[160px]">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              关于我们
            </Button>
          </Link>
        </div>

        {/* 装饰性元素 */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
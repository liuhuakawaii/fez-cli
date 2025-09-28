/**
 * 布局组件
 * 提供应用的基础布局结构，包括导航栏和主内容区域
 * 采用响应式设计，适配不同屏幕尺寸
 */

import { Link, Outlet, useLocation } from 'react-router-dom'
import { APP_CONFIG } from '@/constants'
import { cn } from '@/utils/cn'

export default function Layout() {
  const location = useLocation()

  // 判断当前路由是否激活
  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/"
                  className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {APP_CONFIG.name}
                </Link>
              </div>

              {/* 导航链接 */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={cn(
                    "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                    isActiveRoute('/')
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  首页
                </Link>
                <Link
                  to="/about"
                  className={cn(
                    "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                    isActiveRoute('/about')
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  关于
                </Link>
              </div>
            </div>

            {/* 右侧操作区域 */}
            <div className="flex items-center space-x-4">
              {/* 可以在这里添加用户菜单、主题切换等 */}
              {APP_CONFIG.isDev && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  开发模式
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActiveRoute('/')
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              首页
            </Link>
            <Link
              to="/about"
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActiveRoute('/about')
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              关于
            </Link>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="container-responsive py-8">
        <Outlet />
      </main>

      {/* 页脚（可选） */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container-responsive py-4">
          <div className="text-center text-sm text-gray-500">
            © 2024 {APP_CONFIG.name}. Version {APP_CONFIG.version}
          </div>
        </div>
      </footer>
    </div>
  )
}
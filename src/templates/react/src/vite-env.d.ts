/// <reference types="vite/client" />

/**
 * Vite 环境类型定义文件
 * 
 * 这个文件的作用：
 * 1. 引入 Vite 的客户端类型定义，提供 import.meta.env 等 API 的类型支持
 * 2. 可以在这里扩展全局类型定义和环境变量类型
 * 3. 为 Vite 特有的功能（如 HMR、静态资源导入等）提供类型支持
 */

// 扩展 ImportMetaEnv 接口，为环境变量提供类型安全
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEV_MODE: string
  readonly VITE_LOG_LEVEL: string
  // 添加更多环境变量类型...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 扩展全局类型定义（如果需要）
declare global {
  // 例如：为 window 对象添加自定义属性
  interface Window {
    // gtag?: (...args: any[]) => void
    // dataLayer?: any[]
  }
}
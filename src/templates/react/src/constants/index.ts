/**
 * 应用常量配置
 * 集中管理应用中使用的常量，便于维护和修改
 */

// 应用基本信息
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_TITLE || 'liuhuakawaii-playground',
  version: import.meta.env.VITE_APP_VERSION || '0.1.0',
  isDev: import.meta.env.DEV,
} as const

// API 相关常量
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10秒超时
  retryAttempts: 3,
} as const

// 路由常量
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
} as const

// HTTP 状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// 本地存储键名常量
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const
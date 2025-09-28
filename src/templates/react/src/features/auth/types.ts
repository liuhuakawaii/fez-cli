/**
 * 认证功能相关类型定义
 * 定义登录、注册、会话管理等认证相关的数据结构
 */

import { BaseUser, UserRole } from '@/types/entities/user'

// 登录凭据
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// 注册数据
export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

// 认证用户信息（包含会话信息）
export interface AuthUser extends BaseUser {
  role: UserRole
  token: string
  refreshToken?: string
  expiresAt: string
  permissions: string[]
  lastLoginAt?: string
}

// 会话信息
export interface AuthSession {
  user: AuthUser
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// 密码重置请求
export interface PasswordResetRequest {
  email: string
}

// 密码重置确认
export interface PasswordResetConfirm {
  token: string
  newPassword: string
  confirmPassword: string
}

// 邮箱验证
export interface EmailVerification {
  token: string
}

// OAuth 提供商
export type OAuthProvider = 'google' | 'github' | 'facebook' | 'twitter'

// OAuth 登录数据
export interface OAuthLoginData {
  provider: OAuthProvider
  code: string
  redirectUri: string
}

// 认证状态枚举
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

// 认证错误类型
export interface AuthError {
  code: string
  message: string
  field?: string // 字段级错误
}
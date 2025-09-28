/**
 * 用户实体类型定义
 * 定义用户相关的基础数据结构
 */

import { BaseEntity } from '../common'

// 基础用户接口
export interface BaseUser extends BaseEntity {
  email: string
  name: string
  avatar?: string
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator', 
  USER = 'user',
  GUEST = 'guest'
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

// 完整用户信息
export interface User extends BaseUser {
  role: UserRole
  status: UserStatus
  lastLoginAt?: string
  emailVerified: boolean
  profile?: UserProfile
}

// 用户档案信息
export interface UserProfile {
  firstName?: string
  lastName?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisible: boolean
    emailVisible: boolean
  }
}
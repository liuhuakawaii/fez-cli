/**
 * 待办事项 Store
 * 真实业务场景：任务管理、待办列表
 * 
 * 展示：
 * - 列表状态管理（增删改查）
 * - 过滤和排序
 * - 批量操作
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { TodoState, Todo } from '../types'

/**
 * 待办事项 Store
 * 
 * 功能：
 * - 添加待办
 * - 更新待办状态（完成/未完成）
 * - 删除待办
 * - 编辑待办内容
 * - 过滤（全部/进行中/已完成）
 * - 批量操作
 */
export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      // 状态
      todos: [],
      filter: 'all', // 'all' | 'active' | 'completed'

      // 添加待办
      addTodo: (title: string) => {
        const newTodo: Todo = {
          id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set({ todos: [newTodo, ...get().todos] })
        return newTodo
      },

      // 切换完成状态
      toggleTodo: (id: string) => {
        set({
          todos: get().todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
              : todo
          ),
        })
      },

      // 更新待办内容
      updateTodo: (id: string, title: string) => {
        set({
          todos: get().todos.map((todo) =>
            todo.id === id
              ? { ...todo, title, updatedAt: new Date().toISOString() }
              : todo
          ),
        })
      },

      // 删除待办
      deleteTodo: (id: string) => {
        set({ todos: get().todos.filter((todo) => todo.id !== id) })
      },

      // 设置过滤条件
      setFilter: (filter: 'all' | 'active' | 'completed') => {
        set({ filter })
      },

      // 获取过滤后的待办列表
      getFilteredTodos: () => {
        const { todos, filter } = get()
        switch (filter) {
          case 'active':
            return todos.filter((todo) => !todo.completed)
          case 'completed':
            return todos.filter((todo) => todo.completed)
          default:
            return todos
        }
      },

      // 批量完成
      completeAll: () => {
        set({
          todos: get().todos.map((todo) => ({
            ...todo,
            completed: true,
            updatedAt: new Date().toISOString(),
          })),
        })
      },

      // 批量删除已完成
      clearCompleted: () => {
        set({ todos: get().todos.filter((todo) => !todo.completed) })
      },

      // 获取统计信息
      getStats: () => {
        const todos = get().todos
        return {
          total: todos.length,
          active: todos.filter((todo) => !todo.completed).length,
          completed: todos.filter((todo) => todo.completed).length,
        }
      },
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)


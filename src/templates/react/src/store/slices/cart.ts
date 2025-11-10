/**
 * 购物车 Store
 * 真实业务场景：电商购物车管理
 * 
 * 展示：
 * - 复杂状态管理（商品列表、数量、总价计算）
 * - 选择器优化（避免不必要的重渲染）
 * - 计算属性（derived state）
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartState, CartItem } from '../types'

/**
 * 购物车商品接口
 */
export interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
}

/**
 * 购物车 Store
 * 
 * 功能：
 * - 添加商品到购物车
 * - 更新商品数量
 * - 删除商品
 * - 清空购物车
 * - 计算总价和总数量
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // 状态
      items: [],

      // 添加商品到购物车
      addItem: (product: Product, quantity: number = 1) => {
        const { items } = get()
        const existingItem = items.find((item) => item.productId === product.id)

        if (existingItem) {
          // 如果商品已存在，更新数量
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          // 如果商品不存在，添加新商品
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            price: product.price,
            quantity,
            addedAt: new Date().toISOString(),
          }
          set({ items: [...items, newItem] })
        }
      },

      // 更新商品数量
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })
      },

      // 删除商品
      removeItem: (itemId: string) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
        })
      },

      // 清空购物车
      clearCart: () => {
        set({ items: [] })
      },

      // 计算总价（使用 getter，每次访问时计算）
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      // 计算总数量
      getTotalQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      // 检查商品是否在购物车中
      isItemInCart: (productId: string) => {
        return get().items.some((item) => item.productId === productId)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

/**
 * 选择器：只获取购物车商品列表
 * 使用选择器可以避免不必要的重渲染
 * 当其他状态（如总价）变化时，只订阅 items 的组件不会重新渲染
 */
export const useCartItems = () => useCartStore((state) => state.items)

/**
 * 选择器：只获取总价
 * 当 items 变化时，这个选择器会自动重新计算
 */
export const useCartTotalPrice = () =>
  useCartStore((state) => state.getTotalPrice())

/**
 * 选择器：只获取总数量
 */
export const useCartTotalQuantity = () =>
  useCartStore((state) => state.getTotalQuantity())


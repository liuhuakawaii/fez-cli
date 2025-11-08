/**
 * 数据获取 Hook
 * 提供统一的数据获取接口，支持缓存、重试、取消等功能
 * 基于 axios 实现
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { request } from '@/services/request'
import { handleApiError } from '@/services/errorHandler'
import type { AsyncState } from '@/types'
import type { RequestConfig } from '@/services/request'

interface UseFetchOptions extends RequestConfig {
  // 是否立即执行请求
  immediate?: boolean
  // 依赖项数组，当依赖变化时重新请求
  deps?: any[]
  // 成功回调
  onSuccess?: (data: any) => void
  // 错误回调
  onError?: (error: string) => void
}

interface UseFetchResult<T> extends AsyncState<T> {
  // 手动触发请求
  refetch: () => Promise<void>
  // 取消请求
  cancel: () => void
}

/**
 * 基础数据获取 Hook
 */
export function useFetch<T>(
  endpoint: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const {
    immediate = true,
    deps = [],
    onSuccess,
    onError,
    ...requestConfig
  } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null
  })

  const cancelTokenRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)

  // 清理函数
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort()
      }
    }
  }, [])

  const fetchData = useCallback(async () => {
    // 取消之前的请求
    if (cancelTokenRef.current) {
      cancelTokenRef.current.abort()
    }

    // 创建新的 AbortController
    cancelTokenRef.current = new AbortController()

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const data = await request.get<T>(endpoint, {
        ...requestConfig,
        signal: cancelTokenRef.current.signal,
        // 如果设置了onError回调，默认不显示错误提示（由业务组件处理）
        showErrorTip: requestConfig.showErrorTip !== false && !onError,
      })

      if (isMountedRef.current) {
        setState({ data, isLoading: false, error: null })
        onSuccess?.(data)
      }
    } catch (error: any) {
      if (isMountedRef.current && error.name !== 'AbortError' && !error.message?.includes('canceled')) {
        const errorMessage = handleApiError(error)
        setState({ data: null, isLoading: false, error: errorMessage })
        onError?.(errorMessage)
      }
    }
  }, [endpoint, ...deps, onSuccess, onError])

  const cancel = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.abort()
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [fetchData, immediate])

  return {
    ...state,
    refetch: fetchData,
    cancel
  }
}

/**
 * 支持分页的数据获取 Hook
 */
export function usePaginatedFetch<T>(
  endpoint: string,
  options: UseFetchOptions & {
    page?: number
    pageSize?: number
  } = {}
) {
  const { page = 1, pageSize = 10, ...restOptions } = options
  
  const paginatedEndpoint = `${endpoint}?page=${page}&pageSize=${pageSize}`
  
  return useFetch<{
    data: T[]
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }>(paginatedEndpoint, restOptions)
}

/**
 * 支持搜索的数据获取 Hook
 */
export function useSearchFetch<T>(
  endpoint: string,
  searchTerm: string,
  options: UseFetchOptions & {
    debounceMs?: number
    minLength?: number
  } = {}
) {
  const { debounceMs = 300, minLength = 2, ...restOptions } = options
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  const searchEndpoint = debouncedSearchTerm.length >= minLength 
    ? `${endpoint}?search=${encodeURIComponent(debouncedSearchTerm)}`
    : ''

  return useFetch<T[]>(searchEndpoint, {
    ...restOptions,
    immediate: searchEndpoint !== '',
    deps: [debouncedSearchTerm]
  })
}

/**
 * 无限滚动数据获取 Hook
 */
export function useInfiniteScroll<T>(
  endpoint: string,
  options: UseFetchOptions & {
    pageSize?: number
  } = {}
) {
  const { pageSize = 10, ...restOptions } = options
  const [page, setPage] = useState(1)
  const [allData, setAllData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)

  const { isLoading, error, refetch } = useFetch<{
    data: T[]
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }>(`${endpoint}?page=${page}&pageSize=${pageSize}`, {
    ...restOptions,
    deps: [page],
    onSuccess: (newData) => {
      if (page === 1) {
        setAllData(newData.data)
      } else {
        setAllData(prev => [...prev, ...newData.data])
      }
      setHasMore(page < newData.pagination.totalPages)
    }
  })

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }, [isLoading, hasMore])

  const reset = useCallback(() => {
    setPage(1)
    setAllData([])
    setHasMore(true)
  }, [])

  return {
    data: allData,
    isLoading,
    error,
    hasMore,
    loadMore,
    reset,
    refetch: () => {
      reset()
      return refetch()
    }
  }
}
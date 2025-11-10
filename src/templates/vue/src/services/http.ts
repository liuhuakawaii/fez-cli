import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useToastStore } from '@/store'

const baseURL = import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com'

class HttpClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL,
      timeout: 10_000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => {
      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const toastStore = useToastStore()
        toastStore.push({
          title: 'Request failed',
          description: error?.message ?? 'An unexpected error occurred',
          variant: 'error',
        })
        return Promise.reject(error)
      },
    )
  }

  request<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config)
  }

  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config)
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config)
  }
}

export const httpClient = new HttpClient()


import type { AxiosResponse } from 'axios'
import { httpClient } from './http'

export interface TodoResponse {
  userId: number
  id: number
  title: string
  completed: boolean
}

export function fetchTodos(limit = 5): Promise<AxiosResponse<TodoResponse[]>> {
  return httpClient.get<TodoResponse[]>('/todos', {
    params: {
      _limit: limit,
    },
  })
}


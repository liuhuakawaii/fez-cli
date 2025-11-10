import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

interface Todo {
  id: number
  title: string
  completed: boolean
}

export const useAppStore = defineStore('app', () => {
  const username = ref('Vue Explorer')
  const todos = ref<Todo[]>([])
  const isLoadingTodos = ref(false)

  const completedTodos = computed(() => todos.value.filter((todo) => todo.completed))

  function setUsername(newName: string) {
    username.value = newName
  }

  function setTodos(nextTodos: Todo[]) {
    todos.value = nextTodos
  }

  function setTodosLoading(loading: boolean) {
    isLoadingTodos.value = loading
  }

  return {
    username,
    todos,
    isLoadingTodos,
    completedTodos,
    setUsername,
    setTodos,
    setTodosLoading,
  }
})


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
import { useToast } from '@/composables/useToast'
import { fetchTodos } from '@/services/todos'

const appStore = useAppStore()
const { username, todos, isLoadingTodos, completedTodos } = storeToRefs(appStore)

const { success, error, info } = useToast()

const newName = ref(username.value)

const todoLimit = ref(5)

const todoStats = computed(() => ({
  total: todos.value.length,
  completed: completedTodos.value.length,
  pending: todos.value.length - completedTodos.value.length,
}))

async function loadTodos() {
  try {
    appStore.setTodosLoading(true)
    const response = await fetchTodos(todoLimit.value)
    appStore.setTodos(response.data)
    success('Todos updated', `Loaded ${response.data.length} items`)
  } catch (err) {
    error('Failed to load todos', (err as Error)?.message)
  } finally {
    appStore.setTodosLoading(false)
  }
}

function updateUsername() {
  appStore.setUsername(newName.value)
  info('Profile updated', `Welcome, ${newName.value}!`)
}

onMounted(() => {
  if (!todos.value.length) {
    void loadTodos()
  }
})
</script>

<template>
  <div class="space-y-10">
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-slate-900">Welcome, {{ username }}</h1>
      <p class="mt-2 text-sm text-slate-600">
        This is a tiny yet thoughtful Vue starter showcasing a clean architecture pattern,
        Pinia global state, API orchestration and toast notifications.
      </p>

      <form class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end" @submit.prevent="updateUsername">
        <label class="flex-1 text-sm font-medium text-slate-700">
          Display name
          <input
            v-model="newName"
            class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Who should we call you?"
          />
        </label>
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          type="submit"
        >
          Update name
        </button>
      </form>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Remote todos</h2>
          <p class="mt-1 text-sm text-slate-600">Powered by a minimal axios wrapper + Pinia store.</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-600">
            Limit
            <select
              v-model.number="todoLimit"
              class="ml-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="8">8</option>
            </select>
          </label>
          <button
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            :disabled="isLoadingTodos"
            @click="loadTodos"
          >
            {{ isLoadingTodos ? 'Loading…' : 'Load todos' }}
          </button>
        </div>
      </div>

      <dl class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <dt class="text-xs uppercase tracking-wide text-slate-500">Total</dt>
          <dd class="mt-2 text-2xl font-semibold text-slate-900">{{ todoStats.total }}</dd>
        </div>
        <div class="rounded-xl border border-slate-100 bg-green-50 p-4">
          <dt class="text-xs uppercase tracking-wide text-green-600">Completed</dt>
          <dd class="mt-2 text-2xl font-semibold text-green-700">{{ todoStats.completed }}</dd>
        </div>
        <div class="rounded-xl border border-slate-100 bg-amber-50 p-4">
          <dt class="text-xs uppercase tracking-wide text-amber-700">Pending</dt>
          <dd class="mt-2 text-2xl font-semibold text-amber-800">{{ todoStats.pending }}</dd>
        </div>
      </dl>

      <ul class="mt-6 space-y-3">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <span
            class="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full"
            :class="todo.completed ? 'bg-green-500' : 'bg-amber-500'"
          />
          <div>
            <p class="text-sm font-medium text-slate-900">
              {{ todo.title }}
            </p>
            <p class="text-xs text-slate-500">
              {{ todo.completed ? 'Completed' : 'In progress' }}
            </p>
          </div>
        </li>
      </ul>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-900">Toast playground</h2>
      <p class="mt-1 text-sm text-slate-600">
        Trigger any experience-friendly toast to understand the design language.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          type="button"
          @click="info('Heads up', 'This is a lightweight toast powered by Pinia!')"
        >
          Info toast
        </button>
        <button
          class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
          type="button"
          @click="success('Mission accomplished', 'You just triggered a success toast')"
        >
          Success toast
        </button>
        <button
          class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
          type="button"
          @click="error('Something went wrong', 'Error toasts also come with action feedback')"
        >
          Error toast
        </button>
      </div>
    </section>
  </div>
</template>


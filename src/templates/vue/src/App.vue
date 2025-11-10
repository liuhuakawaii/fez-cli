<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastHost from '@/components/ToastHost.vue'

const currentYear = new Date().getFullYear()
const appTitle = (import.meta.env.VITE_APP_TITLE ?? 'vueaaa') as string
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-2 text-lg font-semibold">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            V
          </span>
          <div class="flex flex-col leading-tight">
            <span>{{ appTitle }}</span>
            <span class="text-xs font-normal text-slate-500">Small. Delightful. Productive.</span>
          </div>
        </div>
        <nav class="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
          <span class="font-medium text-slate-900">Home</span>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl px-6 py-10">
      <RouterView />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-6 text-sm text-slate-500 sm:flex-row">
        <span>Crafted with Vue 3 + Vite + Tailwind CSS</span>
        <span>© {{ currentYear }} VueAAA Starter</span>
      </div>
    </footer>

    <ToastHost />
  </div>
</template>
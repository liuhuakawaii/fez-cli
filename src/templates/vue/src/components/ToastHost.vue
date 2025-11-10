<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

const { messages, dismiss } = useToast()

const variants = computed(() => ({
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
}))
</script>

<template>
  <div class="fixed inset-x-0 top-4 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
    <transition-group
      enter-active-class="transition transform ease-out duration-200"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition transform ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-for="toast in messages"
        :key="toast.id"
        class="w-full max-w-sm rounded-xl shadow-lg ring-1 ring-black/10"
        :class="variants[toast.variant ?? 'info']"
      >
        <div class="flex items-start gap-3 p-4">
          <div class="flex-1">
            <p class="text-sm font-semibold">
              {{ toast.title }}
            </p>
            <p v-if="toast.description" class="mt-1 text-sm opacity-90">
              {{ toast.description }}
            </p>
          </div>
          <button
            class="rounded-full bg-black/10 p-1 text-xs uppercase tracking-wide transition hover:bg-black/20"
            type="button"
            @click="dismiss(toast.id)"
          >
            Close
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>


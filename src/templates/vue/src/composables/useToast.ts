import { storeToRefs } from 'pinia'
import { useToastStore } from '@/store'

export function useToast() {
  const toastStore = useToastStore()
  const { messages } = storeToRefs(toastStore)

  return {
    messages,
    push: toastStore.push,
    dismiss: toastStore.dismiss,
    clear: toastStore.clear,
    info: (title: string, description?: string) =>
      toastStore.push({ title, description, variant: 'info' }),
    success: (title: string, description?: string) =>
      toastStore.push({ title, description, variant: 'success' }),
    warning: (title: string, description?: string) =>
      toastStore.push({ title, description, variant: 'warning' }),
    error: (title: string, description?: string) =>
      toastStore.push({ title, description, variant: 'error' }),
  }
}


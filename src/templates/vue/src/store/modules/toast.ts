import { defineStore } from 'pinia'

export interface ToastMessage {
  id: number
  title: string
  description?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

let toastId = 0

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[],
  }),
  actions: {
    push(message: Omit<ToastMessage, 'id'>) {
      const duration = message.duration ?? 3000
      const id = ++toastId
      const toast: ToastMessage = {
        variant: 'info',
        ...message,
        id,
        duration,
      }
      this.messages.push(toast)
      if (duration > 0) {
        window.setTimeout(() => {
          this.dismiss(id)
        }, duration)
      }
      return id
    },
    dismiss(id: number) {
      this.messages = this.messages.filter((message) => message.id !== id)
    },
    clear() {
      this.messages = []
    },
  },
})


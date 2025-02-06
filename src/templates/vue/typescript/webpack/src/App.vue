<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <h1 class="text-4xl font-bold"><%= projectName %></h1>
    <div class="mt-8">
      <button 
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        @click="count++"
      >
        count is {{ count }}
      </button>
    </div>
  </div>
</template> 
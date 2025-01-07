import { defineConfig } from 'vite'
<% if (framework === 'react') { %>
import react from '@vitejs/plugin-react'
<% } else { %>
import vue from '@vitejs/plugin-vue'
<% } %>

export default defineConfig({
  plugins: [<%= framework === 'react' ? 'react()' : 'vue()' %>],
})

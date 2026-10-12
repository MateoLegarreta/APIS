import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
       '/products':   'http://localhost:4002',
       '/categories': 'http://localhost:4002',
       '/cart':       'http://localhost:4002',
       '/orders':     'http://localhost:4002',
       '/users':      'http://localhost:4002',
       '/api':        'http://localhost:4002',
  }
  
}
})
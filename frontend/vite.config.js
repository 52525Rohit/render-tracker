import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: {
      
      origin: 'http://192.168.1.110:5500',
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  base:"./"
})

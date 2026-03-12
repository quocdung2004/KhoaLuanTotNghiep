import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Kích hoạt HTTPS giả lập
  ],
  server: {
    host: true, // Cho phép các thiết bị trong cùng mạng Wifi truy cập
    port: 5173
  }
})
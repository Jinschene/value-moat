import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: "/value-moat/", // <--- 这里一定要改成你的仓库名，前后都要有斜杠
})

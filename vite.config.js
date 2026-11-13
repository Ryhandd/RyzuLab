import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Only transform JSX in .jsx/.tsx files; keep .js as plain JS so
      // data files with backtick code-spans parse correctly.
      include: /\.(jsx|tsx)$/,
    }),
  ],
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuration for external deployment (without Base44)
// Rename this to vite.config.js if deploying outside Base44

export default defineConfig({
  plugins: [react()],
})


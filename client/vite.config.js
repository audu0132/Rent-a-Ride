import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
      proxy: mode === "development" ? {
        "/api": {
          target: env.VITE_PRODUCTION_BACKEND_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        }
      } : {}
    }
  }
})

// frontend/vite.config.ts
import { fileURLToPath, URL } from "node:url"
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"

export default defineConfig(({ mode }) => {
  // Charge .env.* (on garde le prefixe VITE_ pour cohérence)
  const env = loadEnv(mode, process.cwd(), "")
  // Backend cible pour le proxy (fallback : 3000)
  const backend = env.VITE_API_URL || "http://localhost:3000"

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,       // écoute sur 0.0.0.0 (LAN)
      port: 5173,
      strictPort: true,
      proxy: {
        // Redirige les appels API et ressources backend vers le serveur Node
        "/api":     { target: backend, changeOrigin: true },
        "/meta":    { target: backend, changeOrigin: true },
        "/uploads": { target: backend, changeOrigin: true },
        "/pdfs":    { target: backend, changeOrigin: true },
      },
    },
    // Optionnel: même proxy en "vite preview"
    preview: {
      port: 4173,
      proxy: {
        "/api":     { target: backend, changeOrigin: true },
        "/meta":    { target: backend, changeOrigin: true },
        "/uploads": { target: backend, changeOrigin: true },
        "/pdfs":    { target: backend, changeOrigin: true },
      },
    },
  }
})

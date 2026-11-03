import react from '@vitejs/plugin-react'
import { defineConfig, type Connect } from 'vite'

// /api/* are Vercel functions. Locally (dev + preview) answer 204, exactly what
// production returns without a GEMINI_API_KEY, so Juice It falls back silently.
const apiStub: Connect.NextHandleFunction = (req, res, next) => {
  if (req.url?.startsWith('/api/')) { res.statusCode = 204; res.end(); return }
  next()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kiwiw-api-stub',
      configureServer: (s) => { s.middlewares.use(apiStub) },
      configurePreviewServer: (s) => { s.middlewares.use(apiStub) },
    },
  ],
})

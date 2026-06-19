import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ws': {
        target: 'https://api.amacor.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // /api/ws?endpoint=ws_Login&Tipo=USR → /webservice/ws_Login?Tipo=USR
          const url = new URL(path, 'http://localhost');
          const endpoint = url.searchParams.get('endpoint') || '';
          url.searchParams.delete('endpoint');
          const remaining = url.searchParams.toString();
          return `/webservice/${endpoint}${remaining ? `?${remaining}` : ''}`;
        },
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})

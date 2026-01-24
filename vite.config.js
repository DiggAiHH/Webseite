import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const analyze = process.env.ANALYZE === 'true'

  return {
    plugins: [
      react(),
      analyze
        ? visualizer({
            filename: 'dist/bundle-report.html',
            gzipSize: true,
            brotliSize: true,
            open: false
          })
        : null
    ].filter(Boolean),
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  }
})

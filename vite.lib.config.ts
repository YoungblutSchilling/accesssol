import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/sdk/index.ts', import.meta.url)),
      name: 'AccessSol',
      formats: ['es', 'cjs'],
      cssFileName: 'accesssol',
      fileName: (format) => format === 'es' ? 'accesssol.js' : 'accesssol.cjs',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    },
  },
})

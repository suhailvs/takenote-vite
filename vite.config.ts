import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// const rootDir = '/home/suhail/github/takenote-vite';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
        // '@': `${rootDir}/src/client`,
        // '@resources': `${rootDir}/src/resources`,
      // '@': resolve(__dirname, 'src/client'), // Adjust "src" if needed
      // '@resources': resolve(__dirname, 'src/resources'),
    },
  },
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'

const rootDir = resolve(__dirname)

export default defineConfig({
  plugins: [
    vue(),
    alias({
      entries: [
        {
          find: '@src',
          replacement: resolve(rootDir, 'src')
        }
      ]
    })
  ]
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://pacific-hollows-47308.herokuapp.com',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // }
})

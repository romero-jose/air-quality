import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'

import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  server: {
    port: 3000,
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), nitro(), viteReact()],
  resolve: { tsconfigPaths: true },
})

export default config

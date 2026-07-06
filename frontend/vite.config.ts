import { defineConfig, loadEnv } from 'vite'

import tailwindcss from '@tailwindcss/vite'

import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: 3000,
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackStart(),
      nitro(),
      viteReact(),
      sentryTanstackStart({
        org: 'na-5vj',
        project: 'air-quality-frontend',
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
      }),
    ],
    resolve: { tsconfigPaths: true },
  }
})

export default config

import 'uno.css'

import type { App } from 'vue'
import pinia from '@/plugins/pinia'
import { primeVuePlugin } from '@/plugins/primevue'

export default (app: App) => {
  app.use(pinia)
  app.use(primeVuePlugin, {
    theme: 'none', // Using tailwindcss instead
  })
}

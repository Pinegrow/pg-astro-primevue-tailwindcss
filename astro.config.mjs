import { EventEmitter } from 'events'

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwind from '@astrojs/tailwind'
// import preact from '@astrojs/preact'
// import react from '@astrojs/react'
import solidJs from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import Pinegrow from '@pinegrow/astro-module'
import AutoImportComponents from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import AutoImportAPIs from 'unplugin-auto-import/astro'
import Unocss from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import { unheadVueComposablesImports } from '@unhead/vue'

// import myAstroModule from './src/modules/my-module'

// import { visualizer } from 'rollup-plugin-visualizer'

import siteMeta from './src/site'
// Increasing the maxListeners from default 10 to 15 as there are more than 10 vite plugins (mostly vite/astro) ones using fswatcher
EventEmitter.defaultMaxListeners = 15
const { url } = siteMeta

// https://astro.build/config
export default defineConfig({
  site: url,
  integrations: [
    // myAstroModule,
    vue({
      appEntrypoint: '/src/app',
      devtools: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'lite-youtube',
        },
      },
    }),
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    // preact({
    //   include: ['**/preact/*'],
    // }),
    // react({
    //   include: ['**/react/*'],
    // }),
    solidJs({
      include: ['**/solid/*'],
    }),
    svelte(),
    mdx(),
    sitemap(),
    // For details, refer to https://github.com/antfu/unplugin-auto-import#configuration
    AutoImportAPIs({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
        /\.mdx$/, // .mdx
      ],

      imports: [
        'vue',
        // 'vue-router',
        // 'vue-i18n',
        // 'vue/macros',
        unheadVueComposablesImports,
        '@vueuse/core',
        'pinia',
      ],
      dirs: [
        /* Please ensure that you update the filenames and paths to accurately match those used in your project. */
        'src/composables',
        'src/utils',
        'src/stores',
        '**/pg-*/**', // To auto-import composables from Vue Designer plugins.
      ],
      vueTemplate: true,
      dts: 'auto-imports.d.ts',
    }),
    Pinegrow({
      liveDesigner: {
        iconPreferredCase: 'unocss', // default value (can be removed), unocss by default uses the unocss format for icon names
        tailwindcss: {
          configPath: 'tailwind.config.ts',
          cssPath: '@/assets/css/tailwind.css',
          // themePath: false, // Set to false so that Design Panel is not used
          // restartOnConfigUpdate: true,
          restartOnThemeUpdate: true,
        },
        primevue: {
          /* Please ensure that you update the filenames and paths to accurately match those used in your project. */
          configPath: 'primevue.config.ts', // or file where primevue is created
          utilities: false,
          themePath: false, // Set to false so that Design Panel is not used
          // restartOnConfigUpdate: true,
          // restartOnThemeUpdate: true,
        },
        // plugins: [
        //   {
        //     name: 'My Awesome Lib 3.0',
        //     key: 'my-awesome-lib',
        //     pluginPath: fileURLToPath(
        //       new URL('./web-types/my-awesome-lib.json', import.meta.url),
        //     ),
        //   },
        // ],
      },
    }),
  ],
  vite: {
    plugins: [
      // For details, refer to https://github.com/antfu/unplugin-vue-components#configuration
      AutoImportComponents({
        /* Please ensure that you update the filenames and paths to accurately match those used in your project. */

        dirs: ['src/components'], // allow auto load markdown components under ./src/components/
        extensions: ['vue', 'md'], // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.mdx?/],
        resolvers: [PrimeVueResolver()], // Auto-import using resolvers
        dts: 'components.d.ts',
      }),
      Unocss({
        presets: [
          presetIcons({
            prefix: 'i-', // default prefix, do not change
          }),
        ],
        content: {
          pipeline: {
            /* Please ensure that you update the filenames and paths to accurately match those used in your project. */
            include: ['./src/**/*'],
          },
        },
      }),
    ],

    ssr: {
      noExternal: ['primevue'],
    },

    // build: {
    //   // Vite uses Rollup under the hold, so rollup options & plugins can be used for advanced usage
    //   rollupOptions: {
    //     plugins: [visualizer()],
    //   },
    // },

    resolve: {
      alias: {
        /* Must be either an object, or an array of { find, replacement, customResolver } pairs. */
        /* Refer to: https://vitejs.dev/config/shared-options.html#resolve-alias */
        /* Please ensure that you update the filenames and paths to accurately match those used in your project. */

        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./src', import.meta.url)),
        '~~': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  },
})

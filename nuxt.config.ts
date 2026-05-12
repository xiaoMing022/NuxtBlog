import { seoData } from './data'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-30',
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/doc.css',
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  modules: [
    'nuxt-icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-og-image',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate',
    '@stefanobartoletti/nuxt-social-share',
  ],

  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width,initial-scale=1',
      title: seoData.title,
      titleTemplate: `%s - ${seoData.title}`,
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  sitemap: {
    siteUrl: [seoData.mySite],
  },

  site: {
    url: seoData.mySite,
    name: 'Al Asad Nur Riyad',
  },

  typescript: {
    strict: true,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/rss.xml'],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'dark',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          // 双主题：跟随 color-mode 自动切换
          theme: {
            default: 'github-light',   // 亮色模式
            dark:    'github-dark',    // 暗色模式（.dark class）
          },
          langs: [
            'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss',
            'json', 'yaml', 'markdown', 'bash', 'shell', 'python',
            'java', 'sql', 'go', 'rust', 'cpp', 'c',
          ],
        },
        toc: {
          depth: 4,        // 解析到 h4
          searchDepth: 3,  // 生成 3 层嵌套目录树
        }
      },
    },
  },

  icon: {
    serverBundle: true, // 把图标打包进构建产物，不再依赖外部请求
  },
  ogImage: {
    // provider: 'satori', // 或者 'puppeteer'
    static: false,       // 提前生成静态文件，不走 http://localhost 请求
  },

})

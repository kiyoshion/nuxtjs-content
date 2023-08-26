// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
  ],
  content: {
    documentDriven: true,
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  },
})

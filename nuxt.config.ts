// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'Bumi — Built for the Future',
      meta: [
        { name: 'description', content: 'Bumi creates trusted technology foundations for organizations ready to move with precision, confidence, and long-term vision.' },
        { property: 'og:title', content: 'Bumi — Built for the Future' },
        { property: 'og:description', content: 'A futuristic corporate technology website inspired by GE Aerospace structure and adapted to the Bumi brand.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },
})

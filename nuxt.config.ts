// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@prisma/nuxt',
    '@vite-pwa/nuxt',
  ],
  runtimeConfig: {
    public: {
      bucketUrl: process.env.BUCKET_URL,
    },
  },
  supabase: {
    redirect: false,
  },
});

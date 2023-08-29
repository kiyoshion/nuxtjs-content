import { useMainStore } from "@/store"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useMainStore()

  if (to.name !== 'guide') {
    store.$patch({ subNav: false })
  }
})

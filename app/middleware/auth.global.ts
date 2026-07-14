/**
 * Global Route Guard — runs on every navigation
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (import.meta.client && !authStore.token) {
    authStore.hydrate()
  }

  const isAuthPage = to.path === '/login'

  if (!authStore.isAuthenticated && !isAuthPage) {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && isAuthPage) {
    return navigateTo('/')
  }
})

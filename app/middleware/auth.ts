/**
 * Global Route Guard
 * - Redirects unauthenticated users to /login
 * - Redirects already-authenticated users away from /login
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Hydrate from localStorage on first load (client-side)
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

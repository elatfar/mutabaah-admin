/**
 * useApi — wraps $fetch with:
 * - Base URL from env
 * - Auto Bearer token injection
 * - 401/403 → logout + redirect
 *
 * IMPORTANT: Call this inside an action/function, not at store setup root level.
 * useRouter() requires an active Nuxt app context.
 */

function getApiBase(): string {
  return (import.meta.env.NUXT_PUBLIC_API_BASE as string) || 'http://127.0.0.1:8787'
}

export function useApi() {
  // These are safe to call here because useApi() is called lazily inside actions
  const authStore = useAuthStore()
  const router = useRouter()

  async function apiFetch<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> ?? {})
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      return await $fetch<T>(`${getApiBase()}${path}`, { ...options, headers })
    }
    catch (err: unknown) {
      const status = (err as { status?: number; statusCode?: number })?.status
        ?? (err as { status?: number; statusCode?: number })?.statusCode

      if (status === 401 || status === 403) {
        authStore.logout()
        await router.push('/login')
        throw err
      }
      throw err
    }
  }

  return { apiFetch }
}

/**
 * Composable: useApi
 * Wraps $fetch with base URL, Authorization header injection,
 * and automatic 401/403 → logout + redirect handling.
 */

const BASE_URL = 'http://127.0.0.1:8787'

export function useApi() {
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
      return await $fetch<T>(`${BASE_URL}${path}`, {
        ...options,
        headers
      })
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

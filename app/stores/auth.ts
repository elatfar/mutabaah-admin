import { defineStore } from 'pinia'

export type UserRole = 'MEMBER' | 'LEADER' | 'TEACHER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  status?: UserStatus
}

interface LoginResponse {
  token: string
  user?: AuthUser
}

interface RegisterResponse {
  id: number
  message: string
}

function getApiBase(): string {
  return (import.meta.env.NUXT_PUBLIC_API_BASE as string) || 'http://127.0.0.1:8787'
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role ?? null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isTeacher = computed(() => user.value?.role === 'TEACHER')
  const isLeader = computed(() => user.value?.role === 'LEADER')
  const isMember = computed(() => user.value?.role === 'MEMBER' || user.value?.role === 'LEADER')

  function hydrate() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('mb_token')
      const storedUser = localStorage.getItem('mb_user')
      if (storedToken) token.value = storedToken
      if (storedUser) {
        try { user.value = JSON.parse(storedUser) }
        catch { /* ignore */ }
      }
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<LoginResponse>(`${getApiBase()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, password }
      })
      token.value = res.token
      user.value = res.user ?? decodeUserFromToken(res.token)
      if (import.meta.client) {
        localStorage.setItem('mb_token', res.token)
        localStorage.setItem('mb_user', JSON.stringify(user.value))
      }
    }
    catch (err: unknown) {
      const status = (err as { status?: number; statusCode?: number })?.status
        ?? (err as { status?: number; statusCode?: number })?.statusCode
      if (status === 403) {
        error.value = 'Akun Anda belum diaktifkan. Hubungi administrator untuk aktivasi.'
      }
      else {
        error.value = extractErrorMessage(err, 'Login gagal. Periksa email dan password.')
      }
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Register no longer auto-logs in — backend returns 201 { id, message }
  async function register(name: string, email: string, password: string, role: 'MEMBER' | 'TEACHER' | 'ADMIN' | 'LEADER') {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<RegisterResponse>(`${getApiBase()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name, email, password, role }
      })
      return res
    }
    catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Registrasi gagal. Coba lagi.')
      throw err
    }
    finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('mb_token')
      localStorage.removeItem('mb_user')
    }
  }

  function decodeUserFromToken(jwt: string): AuthUser | null {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]!))
      return {
        id: payload.sub ?? payload.id ?? 0,
        name: payload.name ?? '',
        email: payload.email ?? '',
        role: payload.role ?? 'MEMBER',
        status: payload.status ?? 'ACTIVE'
      }
    }
    catch { return null }
  }

  function extractErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null) {
      const data = (err as { data?: { message?: string }; message?: string })
      return data?.data?.message ?? data?.message ?? fallback
    }
    return fallback
  }

  return {
    token, user, loading, error,
    isAuthenticated, userRole, isAdmin, isTeacher, isLeader, isMember,
    hydrate, login, register, logout
  }
})

import { defineStore } from 'pinia'

export type UserRole = 'MEMBER' | 'LEADER' | 'TEACHER' | 'ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface LoginResponse {
  token: string
  user?: AuthUser
}

interface RegisterResponse {
  token: string
  user?: AuthUser
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ────────────────────────────────────────────────────────────────
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ──────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role ?? null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isTeacher = computed(() => user.value?.role === 'TEACHER')
  const isMember = computed(() => user.value?.role === 'MEMBER' || user.value?.role === 'LEADER')

  // ── Hydration (from localStorage) ───────────────────────────────────────
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

  // ── Actions ──────────────────────────────────────────────────────────────
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<LoginResponse>('http://127.0.0.1:8787/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, password }
      })
      token.value = res.token
      // Decode user from JWT payload if not returned directly
      if (res.user) {
        user.value = res.user
      }
      else {
        user.value = decodeUserFromToken(res.token)
      }
      if (import.meta.client) {
        localStorage.setItem('mb_token', res.token)
        localStorage.setItem('mb_user', JSON.stringify(user.value))
      }
    }
    catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Login gagal. Periksa email dan password.')
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string, role: 'MEMBER' | 'TEACHER') {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<RegisterResponse>('http://127.0.0.1:8787/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name, email, password, role }
      })
      token.value = res.token
      if (res.user) {
        user.value = res.user
      }
      else {
        user.value = decodeUserFromToken(res.token)
      }
      if (import.meta.client) {
        localStorage.setItem('mb_token', res.token)
        localStorage.setItem('mb_user', JSON.stringify(user.value))
      }
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

  // ── Helpers ──────────────────────────────────────────────────────────────
  function decodeUserFromToken(jwt: string): AuthUser | null {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]!))
      return {
        id: payload.sub ?? payload.id ?? '',
        name: payload.name ?? '',
        email: payload.email ?? '',
        role: payload.role ?? 'MEMBER'
      }
    }
    catch {
      return null
    }
  }

  function extractErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null) {
      const data = (err as { data?: { message?: string }; message?: string })
      return data?.data?.message ?? data?.message ?? fallback
    }
    return fallback
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isTeacher,
    isMember,
    hydrate,
    login,
    register,
    logout
  }
})

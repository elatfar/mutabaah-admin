import { defineStore } from 'pinia'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  createdAt?: string
}

export const useAdminStore = defineStore('admin', () => {
  const { apiFetch } = useApi()
  const toast = useToast()

  // ── State ────────────────────────────────────────────────────────────────
  const users = ref<AdminUser[]>([])
  const loading = ref(false)
  const amalanLoading = ref(false)

  // ── Getters ──────────────────────────────────────────────────────────────
  const usersByRole = computed(() => {
    return {
      ADMIN: users.value.filter(u => u.role === 'ADMIN').length,
      TEACHER: users.value.filter(u => u.role === 'TEACHER').length,
      LEADER: users.value.filter(u => u.role === 'LEADER').length,
      MEMBER: users.value.filter(u => u.role === 'MEMBER').length
    }
  })

  // ── Actions ──────────────────────────────────────────────────────────────
  async function fetchUsers() {
    loading.value = true
    try {
      const data = await apiFetch<AdminUser[]>('/api/admin/users')
      users.value = data
    }
    catch {
      toast.add({ title: 'Gagal memuat pengguna', color: 'error' })
    }
    finally {
      loading.value = false
    }
  }

  async function addAmalan(name: string, isDefault: boolean) {
    amalanLoading.value = true
    try {
      await apiFetch('/api/admin/amalans/master', {
        method: 'POST',
        body: { name, isDefault }
      })
      toast.add({ title: 'Amalan ditambahkan', description: `"${name}" berhasil ditambahkan ke master list.`, color: 'success' })
    }
    catch {
      toast.add({ title: 'Gagal menambah amalan', color: 'error' })
      throw new Error('Failed')
    }
    finally {
      amalanLoading.value = false
    }
  }

  return {
    users,
    loading,
    amalanLoading,
    usersByRole,
    fetchUsers,
    addAmalan
  }
})

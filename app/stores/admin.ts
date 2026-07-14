import { defineStore } from 'pinia'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt?: string
}

export const useAdminStore = defineStore('admin', () => {
  const toast = useToast()

  const users = ref<AdminUser[]>([])
  const loading = ref(false)
  const amalanLoading = ref(false)
  const updatingUserId = ref<number | null>(null)

  const usersByRole = computed(() => ({
    ADMIN: users.value.filter(u => u.role === 'ADMIN').length,
    TEACHER: users.value.filter(u => u.role === 'TEACHER').length,
    LEADER: users.value.filter(u => u.role === 'LEADER').length,
    MEMBER: users.value.filter(u => u.role === 'MEMBER').length
  }))

  const pendingUsers = computed(() => users.value.filter(u => u.status === 'INACTIVE'))
  const activeUsers = computed(() => users.value.filter(u => u.status === 'ACTIVE'))

  async function fetchUsers() {
    const { apiFetch } = useApi()
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

  async function updateUser(id: number, payload: { role?: string; status?: string }) {
    const { apiFetch } = useApi()
    updatingUserId.value = id
    try {
      const updated = await apiFetch<AdminUser>(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: payload
      })
      const idx = users.value.findIndex(u => u.id === id)
      if (idx !== -1) users.value[idx] = updated
      const action = payload.status === 'ACTIVE'
        ? 'diaktifkan'
        : payload.status === 'INACTIVE'
          ? 'dinonaktifkan'
          : 'diperbarui'
      toast.add({ title: `Pengguna berhasil ${action}`, color: 'success' })
      return updated
    }
    catch {
      toast.add({ title: 'Gagal memperbarui pengguna', color: 'error' })
    }
    finally {
      updatingUserId.value = null
    }
  }

  async function activateUser(id: number) {
    return updateUser(id, { status: 'ACTIVE' })
  }

  async function deactivateUser(id: number) {
    return updateUser(id, { status: 'INACTIVE' })
  }

  async function changeRole(id: number, role: string) {
    return updateUser(id, { role })
  }

  async function addAmalan(name: string, isDefault: boolean = true) {
    const { apiFetch } = useApi()
    amalanLoading.value = true
    try {
      await apiFetch('/api/admin/amalans/master', {
        method: 'POST',
        body: { name, isDefault }
      })
      toast.add({
        title: 'Amalan ditambahkan',
        description: `"${name}" berhasil ditambahkan ke master list.`,
        color: 'success'
      })
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
    users, loading, amalanLoading, updatingUserId,
    usersByRole, pendingUsers, activeUsers,
    fetchUsers, updateUser, activateUser, deactivateUser, changeRole, addAmalan
  }
})

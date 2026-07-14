import { defineStore } from 'pinia'

export interface Group {
  id: number
  groupName: string
  joinCode: string
}

export interface ReportItem {
  memberId: number
  memberName: string
  completedLogs: number
}

export const useGroupStore = defineStore('group', () => {
  const toast = useToast()

  const groups = ref<Group[]>([])
  const activeGroupId = ref<number | null>(null)
  const report = ref<ReportItem[]>([])
  const newJoinCode = ref<string | null>(null)
  const loading = ref(false)
  const reportLoading = ref(false)
  const amalanLoading = ref(false)

  async function createGroup(groupName: string) {
    const { apiFetch } = useApi()
    loading.value = true
    try {
      const data = await apiFetch<Group>('/api/group/create', {
        method: 'POST',
        body: { groupName }
      })
      groups.value.unshift(data)
      newJoinCode.value = data.joinCode
      toast.add({ title: 'Kelompok dibuat', description: `Kode bergabung: ${data.joinCode}`, color: 'success' })
      return data
    }
    catch {
      toast.add({ title: 'Gagal membuat kelompok', color: 'error' })
    }
    finally {
      loading.value = false
    }
  }

  async function fetchReport(groupId: number) {
    const { apiFetch } = useApi()
    reportLoading.value = true
    activeGroupId.value = groupId
    try {
      const data = await apiFetch<ReportItem[]>(`/api/group/${groupId}/report`)
      report.value = data
    }
    catch {
      toast.add({ title: 'Gagal memuat laporan', color: 'error' })
    }
    finally {
      reportLoading.value = false
    }
  }

  async function assignLeader(groupId: number, userId: number) {
    const { apiFetch } = useApi()
    try {
      await apiFetch('/api/group/assign-leader', {
        method: 'POST',
        body: { groupId, userId }
      })
      toast.add({ title: 'Ketua berhasil ditetapkan', color: 'success' })
    }
    catch {
      toast.add({ title: 'Gagal menetapkan ketua', color: 'error' })
    }
  }

  async function addGroupAmalan(groupId: number, name: string) {
    const { apiFetch } = useApi()
    amalanLoading.value = true
    try {
      await apiFetch(`/api/group/${groupId}/amalans`, {
        method: 'POST',
        body: { name }
      })
      toast.add({ title: 'Amalan kelompok ditambahkan', description: `"${name}" berhasil ditambahkan.`, color: 'success' })
    }
    catch {
      toast.add({ title: 'Gagal menambah amalan kelompok', color: 'error' })
      throw new Error('Failed')
    }
    finally {
      amalanLoading.value = false
    }
  }

  return {
    groups, activeGroupId, report, newJoinCode,
    loading, reportLoading, amalanLoading,
    createGroup, fetchReport, assignLeader, addGroupAmalan
  }
})

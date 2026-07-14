import { defineStore } from 'pinia'

export interface TrackerItem {
  id: number | null
  amalanId: number
  amalanName: string
  isCompleted: boolean
}

export const useTrackerStore = defineStore('tracker', () => {
  const toast = useToast()

  const amalans = ref<TrackerItem[]>([])
  const loading = ref(false)
  const addingAmalan = ref(false)

  const completedCount = computed(() => amalans.value.filter(a => a.isCompleted).length)
  const totalCount = computed(() => amalans.value.length)
  const progressPercent = computed(() =>
    totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
  )

  async function fetchToday() {
    const { apiFetch } = useApi()
    loading.value = true
    try {
      const data = await apiFetch<TrackerItem[]>('/api/tracker/today')
      amalans.value = data
    }
    catch {
      toast.add({ title: 'Gagal memuat amalan', description: 'Tidak dapat mengambil data hari ini.', color: 'error' })
    }
    finally {
      loading.value = false
    }
  }

  async function toggle(amalanId: number, currentState: boolean) {
    const { apiFetch } = useApi()
    const index = amalans.value.findIndex(a => a.amalanId === amalanId)
    if (index === -1) return

    const newState = !currentState
    const today = new Date().toISOString().split('T')[0]!

    amalans.value[index]!.isCompleted = newState

    try {
      await apiFetch('/api/tracker/toggle', {
        method: 'POST',
        body: { amalanId, isCompleted: newState, date: today }
      })
    }
    catch {
      amalans.value[index]!.isCompleted = currentState
      toast.add({ title: 'Gagal menyimpan', description: 'Perubahan tidak tersimpan. Coba lagi.', color: 'error' })
    }
  }

  async function addPersonalAmalan(name: string) {
    const { apiFetch } = useApi()
    addingAmalan.value = true
    try {
      await apiFetch('/api/tracker/amalans', {
        method: 'POST',
        body: { name }
      })
      toast.add({ title: 'Amalan ditambahkan', description: `"${name}" berhasil ditambahkan.`, color: 'success' })
      await fetchToday()
    }
    catch {
      toast.add({ title: 'Gagal menambah amalan', color: 'error' })
      throw new Error('Failed')
    }
    finally {
      addingAmalan.value = false
    }
  }

  return {
    amalans, loading, addingAmalan,
    completedCount, totalCount, progressPercent,
    fetchToday, toggle, addPersonalAmalan
  }
})

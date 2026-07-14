import { defineStore } from 'pinia'

export interface TrackerItem {
  id: string
  amalanId: string
  amalanName: string
  isCompleted: boolean
}

export const useTrackerStore = defineStore('tracker', () => {
  const { apiFetch } = useApi()
  const toast = useToast()

  // ── State ────────────────────────────────────────────────────────────────
  const amalans = ref<TrackerItem[]>([])
  const loading = ref(false)

  // ── Getters ──────────────────────────────────────────────────────────────
  const completedCount = computed(() => amalans.value.filter(a => a.isCompleted).length)
  const totalCount = computed(() => amalans.value.length)
  const progressPercent = computed(() =>
    totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
  )

  // ── Actions ──────────────────────────────────────────────────────────────
  async function fetchToday() {
    loading.value = true
    try {
      const data = await apiFetch<TrackerItem[]>('/api/tracker/today')
      amalans.value = data
    }
    catch {
      toast.add({ title: 'Gagal memuat data', description: 'Tidak dapat mengambil amalan hari ini.', color: 'error' })
    }
    finally {
      loading.value = false
    }
  }

  async function toggle(amalanId: string, currentState: boolean) {
    const index = amalans.value.findIndex(a => a.amalanId === amalanId)
    if (index === -1) return

    const newState = !currentState
    const today = new Date().toISOString().split('T')[0]!

    // Optimistic update
    amalans.value[index]!.isCompleted = newState

    try {
      await apiFetch('/api/tracker/toggle', {
        method: 'POST',
        body: { amalanId, isCompleted: newState, date: today }
      })
    }
    catch {
      // Revert on failure
      amalans.value[index]!.isCompleted = currentState
      toast.add({
        title: 'Gagal menyimpan',
        description: 'Perubahan tidak tersimpan. Coba lagi.',
        color: 'error'
      })
    }
  }

  return {
    amalans,
    loading,
    completedCount,
    totalCount,
    progressPercent,
    fetchToday,
    toggle
  }
})

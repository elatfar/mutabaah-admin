<script setup lang="ts">
const groupStore = useGroupStore()
const authStore = useAuthStore()

// ── Create group form ────────────────────────────────────────────────────
const newGroupName = ref('')
const showCreateForm = ref(false)

async function handleCreateGroup() {
  if (!newGroupName.value.trim()) return
  await groupStore.createGroup(newGroupName.value.trim())
  newGroupName.value = ''
  showCreateForm.value = false
}

// ── Report table ─────────────────────────────────────────────────────────
const selectedGroupId = ref('')

async function loadReport() {
  if (!selectedGroupId.value) return
  await groupStore.fetchReport(selectedGroupId.value)
}

// ── Assign leader modal ──────────────────────────────────────────────────
const showAssignModal = ref(false)
const assignGroupId = ref('')
const assignUserId = ref('')

async function handleAssignLeader() {
  if (!assignGroupId.value || !assignUserId.value) return
  await groupStore.assignLeader(assignGroupId.value, assignUserId.value)
  showAssignModal.value = false
  assignUserId.value = ''
  assignGroupId.value = ''
}

// ── Table columns ────────────────────────────────────────────────────────
const reportColumns = [
  { key: 'memberName', label: 'Nama Anggota' },
  { key: 'completedLogs', label: 'Amalan Selesai' },
  { key: 'status', label: 'Status' }
]

function completionStatus(logs: number) {
  if (logs >= 7) return { label: 'Aktif', color: 'success' as const }
  if (logs >= 4) return { label: 'Cukup', color: 'warning' as const }
  return { label: 'Perlu Perhatian', color: 'error' as const }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--color-burgundy-800);">Panel Guru</h1>
        <p class="mt-1 text-sm text-slate-500">Selamat datang, {{ authStore.user?.name }}. Kelola kelompok dan pantau progres anggota.</p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Buat Kelompok"
        color="primary"
        size="sm"
        @click="showCreateForm = !showCreateForm"
      />
    </div>

    <!-- Create group form (collapsible) -->
    <Transition name="slide-down">
      <div v-if="showCreateForm" class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div class="h-1" style="background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300));" />
        <div class="p-6">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">Buat Kelompok Baru</h2>
          <form class="flex gap-3" @submit.prevent="handleCreateGroup">
            <UInput
              v-model="newGroupName"
              placeholder="Nama kelompok (misal: Kelompok A Kelas 10)"
              icon="i-lucide-users"
              size="lg"
              class="flex-1"
              required
            />
            <UButton
              type="submit"
              label="Buat"
              color="primary"
              size="lg"
              :loading="groupStore.loading"
            />
            <UButton
              label="Batal"
              variant="ghost"
              color="neutral"
              size="lg"
              @click="showCreateForm = false"
            />
          </form>
        </div>
      </div>
    </Transition>

    <!-- Join code result -->
    <Transition name="fade">
      <div
        v-if="groupStore.newJoinCode"
        class="bg-white rounded-2xl border shadow-xs overflow-hidden"
        style="border-color: var(--color-gold-300);"
      >
        <div class="h-1" style="background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300));" />
        <div class="p-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style="background-color: var(--color-gold-50);"
            >
              <UIcon name="i-lucide-key-round" class="w-5 h-5" style="color: var(--color-gold-600);" />
            </div>
            <div>
              <p class="text-xs text-slate-400">Kode bergabung kelompok baru</p>
              <p class="text-xl font-bold tracking-widest mt-0.5" style="color: var(--color-burgundy-700);">
                {{ groupStore.newJoinCode }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge label="Bagikan ke anggota" variant="outline" size="sm" :style="`border-color: var(--color-gold-400); color: var(--color-gold-700);`" />
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="xs"
              aria-label="Tutup"
              @click="groupStore.newJoinCode = null"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Monitor section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Group report -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <h2 class="text-sm font-semibold text-slate-800">Laporan Kelompok</h2>
          <div class="flex items-center gap-2 flex-1 max-w-xs ml-auto">
            <UInput
              v-model="selectedGroupId"
              placeholder="ID kelompok"
              icon="i-lucide-search"
              size="sm"
              class="flex-1"
            />
            <UButton
              label="Muat"
              color="primary"
              size="sm"
              :loading="groupStore.reportLoading"
              :disabled="!selectedGroupId"
              @click="loadReport"
            />
          </div>
        </div>

        <!-- Table loading -->
        <div v-if="groupStore.reportLoading" class="divide-y divide-slate-50">
          <div v-for="i in 4" :key="i" class="flex items-center gap-4 px-6 py-4">
            <div class="w-32 h-4 rounded bg-slate-100 animate-pulse" />
            <div class="w-16 h-4 rounded bg-slate-100 animate-pulse" />
            <div class="w-20 h-6 rounded-full bg-slate-100 animate-pulse ml-auto" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="groupStore.report.length === 0" class="py-16 text-center">
          <UIcon name="i-lucide-bar-chart-3" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p class="text-sm font-medium text-slate-400">Masukkan ID kelompok untuk melihat laporan</p>
        </div>

        <!-- Report table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100">
                <th
                  v-for="col in reportColumns"
                  :key="col.key"
                  class="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="row in groupStore.report"
                :key="row.memberId"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 font-medium text-slate-800">{{ row.memberName }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 max-w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        style="background-color: var(--color-burgundy-500);"
                        :style="`width: ${Math.min((row.completedLogs / 10) * 100, 100)}%`"
                      />
                    </div>
                    <span class="text-slate-600 font-medium">{{ row.completedLogs }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <UBadge
                    :label="completionStatus(row.completedLogs).label"
                    :color="completionStatus(row.completedLogs).color"
                    variant="subtle"
                    size="sm"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actions panel -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div class="h-1" style="background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300));" />
        <div class="p-6">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">Aksi Kelompok</h2>

          <!-- Assign leader button -->
          <button
            class="w-full flex items-center gap-3 p-4 rounded-xl text-left hover:opacity-90 transition-opacity text-white mb-3"
            style="background: linear-gradient(135deg, var(--color-gold-700), var(--color-gold-500));"
            @click="showAssignModal = true"
          >
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-crown" class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-semibold">Tetapkan Ketua</p>
              <p class="text-xs opacity-70">Assign leader untuk kelompok</p>
            </div>
          </button>

          <button
            class="w-full flex items-center gap-3 p-4 rounded-xl text-left border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-download" class="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700">Ekspor Laporan</p>
              <p class="text-xs text-slate-400">Download ke Excel</p>
            </div>
          </button>

          <!-- Info -->
          <div
            class="mt-4 p-3 rounded-xl text-xs"
            style="background-color: var(--color-burgundy-50); color: var(--color-burgundy-700);"
          >
            <p class="font-semibold mb-1 flex items-center gap-1.5">
              <UIcon name="i-lucide-info" class="w-3.5 h-3.5" />
              Cara memantau
            </p>
            <p class="opacity-80 leading-relaxed">
              Masukkan ID kelompok di kolom pencarian untuk melihat laporan harian anggota.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Leader Modal -->
    <UModal v-model:open="showAssignModal" title="Tetapkan Ketua Kelompok">
      <template #body>
        <form class="space-y-4 p-4" @submit.prevent="handleAssignLeader">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">ID Kelompok</label>
            <UInput
              v-model="assignGroupId"
              placeholder="Masukkan ID kelompok"
              icon="i-lucide-users"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">ID Anggota yang Ditunjuk</label>
            <UInput
              v-model="assignUserId"
              placeholder="Masukkan ID anggota"
              icon="i-lucide-user"
              required
            />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Batal" variant="ghost" color="neutral" @click="showAssignModal = false" />
            <UButton
              type="submit"
              label="Tetapkan Ketua"
              color="primary"
              icon="i-lucide-crown"
            />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

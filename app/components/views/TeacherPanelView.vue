<script setup lang="ts">
const groupStore = useGroupStore()
const authStore = useAuthStore()

// ── Create group ─────────────────────────────────────────────────────────
const newGroupName = ref('')
const showCreateForm = ref(false)

async function handleCreateGroup() {
  if (!newGroupName.value.trim()) return
  const created = await groupStore.createGroup(newGroupName.value.trim())
  if (created) {
    newGroupName.value = ''
    showCreateForm.value = false
    // Auto-load report for newly created group
    activeGroupId.value = String(created.id)
  }
}

// ── Group report ──────────────────────────────────────────────────────────
const activeGroupId = ref('')

async function loadReport() {
  if (!activeGroupId.value) return
  await groupStore.fetchReport(Number(activeGroupId.value))
}

// ── Assign leader ─────────────────────────────────────────────────────────
const showAssignModal = ref(false)
const assignGroupId = ref('')
const assignUserId = ref('')

async function handleAssignLeader() {
  if (!assignGroupId.value || !assignUserId.value) return
  await groupStore.assignLeader(Number(assignGroupId.value), Number(assignUserId.value))
  showAssignModal.value = false
  assignGroupId.value = ''
  assignUserId.value = ''
}

// ── Add group amalan ──────────────────────────────────────────────────────
const showAddAmalanModal = ref(false)
const groupAmalanGroupId = ref('')
const groupAmalanName = ref('')

async function handleAddGroupAmalan() {
  if (!groupAmalanGroupId.value || !groupAmalanName.value.trim()) return
  try {
    await groupStore.addGroupAmalan(Number(groupAmalanGroupId.value), groupAmalanName.value.trim())
    groupAmalanName.value = ''
    showAddAmalanModal.value = false
  }
  catch { /* toasted */ }
}

// ── Status helper ─────────────────────────────────────────────────────────
function completionStatus(logs: number) {
  if (logs >= 7) return { label: 'Aktif', bg: '#dcfce7', color: '#15803d' }
  if (logs >= 4) return { label: 'Cukup', bg: '#fef9c3', color: '#a16207' }
  return { label: 'Perlu Perhatian', bg: '#fee2e2', color: '#b91c1c' }
}
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Panel Guru</h1>
        <p class="mt-1 text-sm text-slate-500">
          Halo, <span class="font-semibold text-slate-700">{{ authStore.user?.name }}</span>. Kelola kelompok dan pantau progres anggota.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity shrink-0"
        style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-600));"
        @click="showCreateForm = !showCreateForm"
      >
        <UIcon :name="showCreateForm ? 'i-lucide-x' : 'i-lucide-plus'" class="w-4 h-4" />
        {{ showCreateForm ? 'Batal' : 'Buat Kelompok' }}
      </button>
    </div>

    <!-- Create group form -->
    <Transition name="slide-down">
      <div v-if="showCreateForm" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="h-0.5" style="background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-400));" />
        <div class="p-6">
          <p class="text-sm font-semibold text-slate-800 mb-4">Buat Kelompok Baru</p>
          <form class="flex gap-3 flex-wrap sm:flex-nowrap" @submit.prevent="handleCreateGroup">
            <UInput
              v-model="newGroupName"
              placeholder="Nama kelompok (cth: Kelompok A — Kelas 10)"
              icon="i-lucide-users"
              size="lg"
              class="flex-1 min-w-0"
              required
            />
            <UButton type="submit" label="Buat Kelompok" color="primary" size="lg" :loading="groupStore.loading" />
          </form>
        </div>
      </div>
    </Transition>

    <!-- Join code result -->
    <Transition name="fade">
      <div
        v-if="groupStore.newJoinCode"
        class="relative overflow-hidden rounded-2xl p-5 border"
        style="background: linear-gradient(135deg, var(--color-gold-50), #fffbeb); border-color: var(--color-gold-300);"
      >
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--color-gold-500);">
              <UIcon name="i-lucide-key-round" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-xs font-semibold mb-1" style="color: var(--color-gold-700);">Kode bergabung kelompok</p>
              <p class="text-3xl font-black tracking-[0.25em]" style="color: var(--color-burgundy-800);">
                {{ groupStore.newJoinCode }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-3 py-1.5 rounded-full" style="background-color: white; color: var(--color-gold-700); border: 1px solid var(--color-gold-300);">
              Bagikan ke anggota
            </span>
            <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors" @click="groupStore.newJoinCode = null">
              <UIcon name="i-lucide-x" class="w-4 h-4" style="color: var(--color-gold-800);" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- Report table -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-2.5 shrink-0">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background-color: var(--color-burgundy-50);">
                <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4" style="color: var(--color-burgundy-600);" />
              </div>
              <span class="text-sm font-semibold text-slate-800">Laporan Kelompok</span>
            </div>
            <div class="flex items-center gap-2 flex-1 sm:ml-auto sm:max-w-sm">
              <UInput
                v-model="activeGroupId"
                placeholder="Masukkan ID kelompok..."
                icon="i-lucide-hash"
                size="sm"
                class="flex-1"
                type="number"
              />
              <UButton
                label="Muat"
                color="primary"
                size="sm"
                :loading="groupStore.reportLoading"
                :disabled="!activeGroupId"
                @click="loadReport"
              />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="groupStore.reportLoading" class="divide-y divide-slate-50">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-5 py-4">
            <div class="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div class="flex-1 h-4 rounded bg-slate-100 animate-pulse" />
            <div class="w-20 h-4 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="groupStore.report.length === 0" class="py-14 flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100">
            <UIcon name="i-lucide-inbox" class="w-6 h-6 text-slate-400" />
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-slate-500">Belum ada data</p>
            <p class="text-xs text-slate-400 mt-0.5">Masukkan ID kelompok untuk melihat laporan harian</p>
          </div>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nama Anggota</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Progres</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in groupStore.report"
                :key="row.memberId"
                class="border-t border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <td class="px-5 py-3.5 text-xs text-slate-400 font-medium">{{ i + 1 }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style="background-color: var(--color-burgundy-100); color: var(--color-burgundy-700);">
                      {{ row.memberName.slice(0, 2).toUpperCase() }}
                    </div>
                    <span class="text-sm font-medium text-slate-800">{{ row.memberName }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden shrink-0">
                      <div
                        class="h-full rounded-full transition-all"
                        style="background-color: var(--color-burgundy-500);"
                        :style="`width: ${Math.min((row.completedLogs / 10) * 100, 100)}%`"
                      />
                    </div>
                    <span class="text-xs font-semibold text-slate-600">{{ row.completedLogs }}<span class="text-slate-400 font-normal">/10</span></span>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    :style="`background-color: ${completionStatus(row.completedLogs).bg}; color: ${completionStatus(row.completedLogs).color};`"
                  >
                    {{ completionStatus(row.completedLogs).label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action panel -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="h-0.5" style="background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-400));" />
          <div class="p-5">
            <p class="text-sm font-semibold text-slate-800 mb-3">Aksi Kelompok</p>
            <div class="space-y-2.5">
              <!-- Add group amalan -->
              <button
                class="w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-white hover:opacity-90 transition-opacity"
                style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-600));"
                @click="showAddAmalanModal = true; groupAmalanGroupId = activeGroupId"
              >
                <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-clipboard-plus" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-semibold">Tambah Amalan Kelompok</p>
                  <p class="text-xs opacity-70">Amalan khusus anggota kelompok ini</p>
                </div>
              </button>

              <!-- Assign leader -->
              <button
                class="w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-white hover:opacity-90 transition-opacity"
                style="background: linear-gradient(135deg, var(--color-gold-700), var(--color-gold-500));"
                @click="showAssignModal = true; assignGroupId = activeGroupId"
              >
                <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-crown" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-semibold">Tetapkan Ketua</p>
                  <p class="text-xs opacity-70">Assign leader untuk kelompok</p>
                </div>
              </button>

              <!-- Export -->
              <button class="w-full flex items-center gap-3 p-3.5 rounded-xl text-left border border-slate-200 hover:bg-slate-50 transition-colors">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-download" class="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-700">Ekspor Laporan</p>
                  <p class="text-xs text-slate-400">Download ke Excel</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Help card -->
        <div class="rounded-2xl p-4 border" style="background-color: var(--color-burgundy-50); border-color: var(--color-burgundy-100);">
          <div class="flex gap-3">
            <UIcon name="i-lucide-lightbulb" class="w-4.5 h-4.5 shrink-0 mt-0.5" style="color: var(--color-gold-600);" />
            <div>
              <p class="text-xs font-semibold mb-1" style="color: var(--color-burgundy-800);">Tips</p>
              <p class="text-xs leading-relaxed" style="color: var(--color-burgundy-600);">
                Muat laporan kelompok terlebih dahulu menggunakan ID kelompok sebelum menambah amalan atau menetapkan ketua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Group Amalan Modal -->
    <UModal v-model:open="showAddAmalanModal" title="Tambah Amalan Kelompok">
      <template #body>
        <form class="space-y-4 p-5" @submit.prevent="handleAddGroupAmalan">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 block">ID Kelompok</label>
            <UInput v-model="groupAmalanGroupId" placeholder="ID kelompok" icon="i-lucide-hash" type="number" required />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 block">Nama Amalan</label>
            <UInput v-model="groupAmalanName" placeholder="Nama amalan untuk kelompok ini..." icon="i-lucide-pencil-line" required />
          </div>
          <div class="p-3 rounded-xl text-xs flex items-start gap-2" style="background-color: var(--color-burgundy-50); color: var(--color-burgundy-700);">
            <UIcon name="i-lucide-info" class="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>Amalan ini hanya akan muncul di tracker anggota kelompok tersebut.</p>
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <UButton label="Batal" variant="ghost" color="neutral" @click="showAddAmalanModal = false" />
            <UButton type="submit" label="Tambahkan" color="primary" icon="i-lucide-plus" :loading="groupStore.amalanLoading" />
          </div>
        </form>
      </template>
    </UModal>

    <!-- Assign Leader Modal -->
    <UModal v-model:open="showAssignModal" title="Tetapkan Ketua Kelompok">
      <template #body>
        <form class="space-y-4 p-5" @submit.prevent="handleAssignLeader">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 block">ID Kelompok</label>
            <UInput v-model="assignGroupId" placeholder="ID kelompok" icon="i-lucide-hash" type="number" required />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 block">ID Anggota yang Ditunjuk</label>
            <UInput v-model="assignUserId" placeholder="ID anggota" icon="i-lucide-user" type="number" required />
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <UButton label="Batal" variant="ghost" color="neutral" @click="showAssignModal = false" />
            <UButton type="submit" label="Tetapkan Ketua" color="primary" icon="i-lucide-crown" />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.22s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

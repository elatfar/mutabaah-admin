<script setup lang="ts">
const adminStore = useAdminStore()
const authStore = useAuthStore()

onMounted(() => adminStore.fetchUsers())

// ── Tabs ─────────────────────────────────────────────────────────────────
const props = defineProps<{ initialTab?: 'users' | 'amalans' }>()
const activeTab = ref<'users' | 'amalans'>(props.initialTab ?? 'users')

// Sync tab when navigating between /pengguna and /amalans
watch(() => props.initialTab, (val) => {
  if (val) activeTab.value = val
})

// ── User management ───────────────────────────────────────────────────────
const searchQuery = ref('')
const filterRole = ref('ALL')
const filterStatus = ref('ALL')

const roleFilterOptions = ['ALL', 'ADMIN', 'TEACHER', 'LEADER', 'MEMBER']
const statusFilterOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Menunggu', value: 'INACTIVE' }
]

const filteredUsers = computed(() => adminStore.users.filter((u) => {
  const q = searchQuery.value.toLowerCase()
  const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  const matchRole = filterRole.value === 'ALL' || u.role === filterRole.value
  const matchStatus = filterStatus.value === 'ALL' || u.status === filterStatus.value
  return matchSearch && matchRole && matchStatus
}))

// Inline role edit state
const editingRoleId = ref<number | null>(null)
const editingRole = ref('')
const roleEditOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Guru', value: 'TEACHER' },
  { label: 'Ketua', value: 'LEADER' },
  { label: 'Anggota', value: 'MEMBER' }
]

function startEditRole(user: { id: number; role: string }) {
  editingRoleId.value = user.id
  editingRole.value = user.role
}

async function saveRole(userId: number) {
  await adminStore.changeRole(userId, editingRole.value)
  editingRoleId.value = null
}

// ── Amalan form ───────────────────────────────────────────────────────────
const amalanName = ref('')
const amalanIsDefault = ref(true)

async function handleAddAmalan() {
  if (!amalanName.value.trim()) return
  try {
    await adminStore.addAmalan(amalanName.value.trim(), amalanIsDefault.value)
    amalanName.value = ''
  }
  catch { /* toasted */ }
}

// ── Role/status config ────────────────────────────────────────────────────
const roleConfig: Record<string, { label: string; bg: string; color: string }> = {
  ADMIN: { label: 'Admin', bg: 'var(--color-burgundy-100)', color: 'var(--color-burgundy-700)' },
  TEACHER: { label: 'Guru', bg: '#fef9c3', color: '#92400e' },
  LEADER: { label: 'Ketua', bg: '#dbeafe', color: '#1e40af' },
  MEMBER: { label: 'Anggota', bg: '#f1f5f9', color: '#475569' }
}

const statCards = computed(() => [
  { role: 'ADMIN', label: 'Admin', icon: 'i-lucide-shield-check', count: adminStore.usersByRole.ADMIN, accent: 'var(--color-burgundy-600)', bg: 'var(--color-burgundy-50)' },
  { role: 'TEACHER', label: 'Guru', icon: 'i-lucide-graduation-cap', count: adminStore.usersByRole.TEACHER, accent: '#d97706', bg: '#fffbeb' },
  { role: 'LEADER', label: 'Ketua', icon: 'i-lucide-crown', count: adminStore.usersByRole.LEADER, accent: '#2563eb', bg: '#eff6ff' },
  { role: 'MEMBER', label: 'Anggota', icon: 'i-lucide-users', count: adminStore.usersByRole.MEMBER, accent: '#475569', bg: '#f8fafc' }
])
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Super Admin</h1>
        <p class="mt-1 text-sm text-slate-500">
          Halo, <span class="font-semibold text-slate-700">{{ authStore.user?.name }}</span>.
          <span v-if="adminStore.pendingUsers.length > 0" class="text-amber-600 font-medium">
            · {{ adminStore.pendingUsers.length }} pengguna menunggu aktivasi.
          </span>
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        @click="adminStore.fetchUsers()"
      >
        <UIcon name="i-lucide-refresh-cw" class="w-4 h-4" :class="adminStore.loading ? 'animate-spin' : ''" />
        Refresh
      </button>
    </div>

    <!-- Pending activation alert -->
    <Transition name="fade">
      <div
        v-if="adminStore.pendingUsers.length > 0"
        class="rounded-2xl p-4 border flex items-start gap-3"
        style="background-color: #fffbeb; border-color: #fde68a;"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background-color: #fef3c7;">
          <UIcon name="i-lucide-clock" class="w-4 h-4" style="color: #d97706;" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold" style="color: #92400e;">
            {{ adminStore.pendingUsers.length }} pengguna menunggu aktivasi
          </p>
          <p class="text-xs mt-0.5" style="color: #b45309;">
            {{ adminStore.pendingUsers.map(u => u.name).join(', ') }}
          </p>
        </div>
        <button
          class="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 hover:opacity-80 transition-opacity"
          style="background-color: #d97706; color: white;"
          @click="filterStatus = 'INACTIVE'; filterRole = 'ALL'; activeTab = 'users'"
        >
          Tampilkan
        </button>
      </div>
    </Transition>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        v-for="card in statCards"
        :key="card.role"
        class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors"
        @click="filterRole = card.role; filterStatus = 'ALL'; activeTab = 'users'"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="`background-color: ${card.bg};`">
          <UIcon :name="card.icon" class="w-5 h-5" :style="`color: ${card.accent};`" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900 leading-none">{{ card.count }}</p>
          <p class="text-xs text-slate-500 mt-0.5">{{ card.label }}</p>
        </div>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="flex gap-1 p-1 rounded-xl bg-slate-100 w-fit">
      <button
        class="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
        :class="activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        @click="activeTab = 'users'"
      >
        <span class="flex items-center gap-2">
          <UIcon name="i-lucide-users" class="w-4 h-4" />
          Pengguna
          <span
            v-if="adminStore.pendingUsers.length > 0"
            class="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white"
            style="background-color: #d97706;"
          >
            {{ adminStore.pendingUsers.length }}
          </span>
        </span>
      </button>
      <button
        class="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
        :class="activeTab === 'amalans' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        @click="activeTab = 'amalans'"
      >
        <span class="flex items-center gap-2">
          <UIcon name="i-lucide-clipboard-list" class="w-4 h-4" />
          Amalan Master
        </span>
      </button>
    </div>

    <!-- USERS TAB -->
    <div v-if="activeTab === 'users'" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="px-5 py-4 border-b border-slate-100 space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <UInput
            v-model="searchQuery"
            placeholder="Cari nama atau email..."
            icon="i-lucide-search"
            size="sm"
            class="flex-1"
          />
          <div class="flex gap-1.5 flex-wrap shrink-0">
            <button
              v-for="opt in statusFilterOptions"
              :key="opt.value"
              class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
              :style="filterStatus === opt.value
                ? 'background-color: var(--color-burgundy-700); color: white; border-color: transparent;'
                : 'background-color: white; color: #64748b; border-color: #e2e8f0;'"
              @click="filterStatus = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="r in roleFilterOptions"
            :key="r"
            class="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            :style="filterRole === r
              ? 'background-color: var(--color-burgundy-100); color: var(--color-burgundy-700);'
              : 'background-color: #f1f5f9; color: #64748b;'"
            @click="filterRole = r"
          >
            {{ r === 'ALL' ? 'Semua Role' : (roleConfig[r]?.label ?? r) }}
          </button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="adminStore.loading" class="divide-y divide-slate-50">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-5 py-4">
          <div class="w-9 h-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 rounded-full bg-slate-100 animate-pulse w-1/3" />
            <div class="h-3 rounded-full bg-slate-100 animate-pulse w-1/2" />
          </div>
          <div class="w-16 h-7 rounded-full bg-slate-100 animate-pulse" />
          <div class="w-24 h-8 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredUsers.length === 0" class="py-14 flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100">
          <UIcon name="i-lucide-search-x" class="w-6 h-6 text-slate-400" />
        </div>
        <p class="text-sm font-semibold text-slate-500">Tidak ada pengguna ditemukan</p>
      </div>

      <!-- User rows -->
      <div v-else class="divide-y divide-slate-50 max-h-[520px] overflow-y-auto">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
          :class="user.status === 'INACTIVE' ? 'opacity-75' : ''"
        >
          <!-- Avatar -->
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative"
            style="background-color: var(--color-burgundy-100); color: var(--color-burgundy-700);"
          >
            {{ user.name.slice(0, 2).toUpperCase() }}
            <!-- Inactive dot -->
            <span
              v-if="user.status === 'INACTIVE'"
              class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
              style="background-color: #f59e0b;"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-semibold text-slate-800 truncate">{{ user.name }}</p>
              <span
                v-if="user.status === 'INACTIVE'"
                class="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                style="background-color: #fef3c7; color: #92400e;"
              >
                Menunggu
              </span>
            </div>
            <p class="text-xs text-slate-400 truncate">{{ user.email }}</p>
          </div>

          <!-- Role (editable) -->
          <div class="shrink-0">
            <div v-if="editingRoleId === user.id" class="flex items-center gap-1.5">
              <select
                v-model="editingRole"
                class="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option v-for="opt in roleEditOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <button class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors" @click="saveRole(user.id)">
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-600" />
              </button>
              <button class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors" @click="editingRoleId = null">
                <UIcon name="i-lucide-x" class="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <button
              v-else
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
              :style="`background-color: ${roleConfig[user.role]?.bg ?? '#f1f5f9'}; color: ${roleConfig[user.role]?.color ?? '#475569'};`"
              @click="startEditRole(user)"
            >
              {{ roleConfig[user.role]?.label ?? user.role }}
              <UIcon name="i-lucide-pencil" class="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>

          <!-- Actions -->
          <div class="shrink-0">
            <button
              v-if="user.status === 'INACTIVE'"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              style="background-color: #16a34a;"
              :class="adminStore.updatingUserId === user.id ? 'opacity-70' : ''"
              :disabled="adminStore.updatingUserId === user.id"
              @click="adminStore.activateUser(user.id)"
            >
              <UIcon v-if="adminStore.updatingUserId === user.id" name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
              <UIcon v-else name="i-lucide-user-check" class="w-3.5 h-3.5" />
              Aktifkan
            </button>
            <button
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              :class="adminStore.updatingUserId === user.id ? 'opacity-70' : ''"
              :disabled="adminStore.updatingUserId === user.id"
              @click="adminStore.deactivateUser(user.id)"
            >
              <UIcon v-if="adminStore.updatingUserId === user.id" name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
              <UIcon v-else name="i-lucide-user-x" class="w-3.5 h-3.5" />
              Nonaktifkan
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs text-slate-400">
          {{ filteredUsers.length }} dari {{ adminStore.users.length }} pengguna
        </span>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5 text-slate-500">
            <span class="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {{ adminStore.activeUsers.length }} aktif
          </span>
          <span class="flex items-center gap-1.5 text-slate-500">
            <span class="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            {{ adminStore.pendingUsers.length }} menunggu
          </span>
        </div>
      </div>
    </div>

    <!-- AMALANS TAB -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <!-- Add form -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="h-0.5" style="background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-400));" />
        <div class="p-6">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: var(--color-gold-100);">
              <UIcon name="i-lucide-clipboard-plus" class="w-4.5 h-4.5" style="color: var(--color-gold-700);" />
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800">Tambah Amalan Master</h2>
              <p class="text-xs text-slate-400 mt-0.5">Berlaku untuk seluruh pengguna sistem</p>
            </div>
          </div>

          <form class="space-y-4" @submit.prevent="handleAddAmalan">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-600 block">Nama Amalan</label>
              <UInput
                v-model="amalanName"
                placeholder="Sholat Dhuha, Tilawah Al-Quran, Dzikir Pagi..."
                icon="i-lucide-pencil-line"
                required
              />
            </div>

            <!-- Default toggle -->
            <button
              type="button"
              class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200"
              :style="amalanIsDefault
                ? 'border-color: var(--color-burgundy-300); background-color: var(--color-burgundy-50);'
                : 'border-color: #e2e8f0; background-color: white;'"
              @click="amalanIsDefault = !amalanIsDefault"
            >
              <div class="text-left">
                <p class="text-sm font-semibold" :style="amalanIsDefault ? 'color: var(--color-burgundy-700);' : 'color: #64748b;'">
                  Jadikan Default
                </p>
                <p class="text-xs mt-0.5 text-slate-400">Otomatis masuk ke tracker semua anggota</p>
              </div>
              <div
                class="w-11 h-6 rounded-full p-0.5 transition-all duration-200 shrink-0"
                :style="amalanIsDefault ? 'background-color: var(--color-burgundy-600);' : 'background-color: #cbd5e1;'"
              >
                <div
                  class="w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  :class="amalanIsDefault ? 'translate-x-5' : 'translate-x-0'"
                />
              </div>
            </button>

            <button
              type="submit"
              class="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-600));"
              :disabled="adminStore.amalanLoading"
            >
              <UIcon v-if="adminStore.amalanLoading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
              <UIcon v-else name="i-lucide-plus" class="w-4 h-4" />
              Tambah ke Master List
            </button>
          </form>
        </div>
      </div>

      <!-- Info card -->
      <div class="rounded-2xl p-5 border" style="background-color: var(--color-burgundy-50); border-color: var(--color-burgundy-100);">
        <h3 class="text-sm font-semibold mb-3" style="color: var(--color-burgundy-800);">Cara Kerja Amalan Master</h3>
        <div class="space-y-3">
          <div v-for="item in [
            { icon: 'i-lucide-globe', title: 'Global', desc: 'Amalan master berlaku untuk semua pengguna di seluruh sistem.' },
            { icon: 'i-lucide-zap', title: 'Default = Otomatis', desc: 'Amalan isDefault:true langsung muncul di tracker harian semua anggota aktif.' },
            { icon: 'i-lucide-settings', title: 'Non-default = Opsional', desc: 'isDefault:false tersedia sebagai pilihan amalan tambahan, tidak otomatis aktif.' },
            { icon: 'i-lucide-layers', title: 'Prioritas Agregasi', desc: 'Tracker menggabungkan: Amalan Global → Amalan Kelompok → Amalan Personal.' }
          ]" :key="item.title" class="flex gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style="background-color: var(--color-burgundy-100);">
              <UIcon :name="item.icon" class="w-3.5 h-3.5" style="color: var(--color-burgundy-600);" />
            </div>
            <div>
              <p class="text-xs font-semibold" style="color: var(--color-burgundy-800);">{{ item.title }}</p>
              <p class="text-xs mt-0.5 leading-relaxed" style="color: var(--color-burgundy-600);">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

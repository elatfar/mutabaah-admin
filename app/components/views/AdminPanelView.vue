<script setup lang="ts">
const adminStore = useAdminStore()
const authStore = useAuthStore()

onMounted(() => adminStore.fetchUsers())

// ── Add amalan form ──────────────────────────────────────────────────────
const amalanName = ref('')
const amalanIsDefault = ref(true)
const amalanLoading = ref(false)

async function handleAddAmalan() {
  if (!amalanName.value.trim()) return
  try {
    amalanLoading.value = true
    await adminStore.addAmalan(amalanName.value.trim(), amalanIsDefault.value)
    amalanName.value = ''
  }
  catch { /* error toasted inside store */ }
  finally {
    amalanLoading.value = false
  }
}

// ── User search & filter ─────────────────────────────────────────────────
const searchQuery = ref('')
const filterRole = ref('ALL')

const roleFilterOptions = ['ALL', 'ADMIN', 'TEACHER', 'LEADER', 'MEMBER']

const filteredUsers = computed(() => {
  return adminStore.users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRole = filterRole.value === 'ALL' || u.role === filterRole.value
    return matchSearch && matchRole
  })
})

// ── Table columns ─────────────────────────────────────────────────────────
const roleBadgeColor: Record<string, 'primary' | 'warning' | 'info' | 'neutral'> = {
  ADMIN: 'primary',
  TEACHER: 'warning',
  LEADER: 'info',
  MEMBER: 'neutral'
}

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  TEACHER: 'Guru',
  LEADER: 'Ketua',
  MEMBER: 'Anggota'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--color-burgundy-800);">
          Super Admin Panel
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Halo, {{ authStore.user?.name }}. Kelola semua pengguna dan amalan master.
        </p>
      </div>
      <UButton
        icon="i-lucide-refresh-cw"
        label="Refresh"
        variant="outline"
        color="neutral"
        size="sm"
        :loading="adminStore.loading"
        @click="adminStore.fetchUsers()"
      />
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        v-for="(count, role) in adminStore.usersByRole"
        :key="role"
        class="bg-white rounded-xl p-4 border border-slate-100 shadow-xs text-center"
      >
        <p class="text-2xl font-bold" style="color: var(--color-burgundy-700);">{{ count }}</p>
        <p class="text-xs font-semibold text-slate-400 mt-0.5">{{ roleLabel[role] ?? role }}</p>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- Users table -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 class="text-sm font-semibold text-slate-800 shrink-0">Semua Pengguna</h2>
          <div class="flex items-center gap-2 flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="Cari nama atau email..."
              icon="i-lucide-search"
              size="sm"
              class="flex-1"
            />
            <!-- Role filter pills -->
            <div class="flex gap-1 shrink-0">
              <button
                v-for="r in roleFilterOptions"
                :key="r"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                :class="filterRole === r
                  ? 'text-white'
                  : 'text-slate-500 bg-slate-100 hover:bg-slate-200'"
                :style="filterRole === r ? `background-color: var(--color-burgundy-600);` : ''"
                @click="filterRole = r"
              >
                {{ r === 'ALL' ? 'Semua' : roleLabel[r] }}
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="adminStore.loading" class="divide-y divide-slate-50">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-6 py-4">
            <div class="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div class="flex-1 space-y-1.5">
              <div class="w-32 h-3.5 rounded bg-slate-100 animate-pulse" />
              <div class="w-48 h-3 rounded bg-slate-100 animate-pulse" />
            </div>
            <div class="w-16 h-6 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredUsers.length === 0" class="py-16 text-center">
          <UIcon name="i-lucide-users-x" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p class="text-sm font-medium text-slate-400">Tidak ada pengguna ditemukan</p>
        </div>

        <!-- User list -->
        <div v-else class="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <!-- Avatar -->
            <UAvatar
              :text="user.name.slice(0, 2).toUpperCase()"
              size="sm"
              :ui="{ fallback: 'text-xs font-semibold' }"
              style="background-color: var(--color-burgundy-100); color: var(--color-burgundy-700);"
            />
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800 truncate">{{ user.name }}</p>
              <p class="text-xs text-slate-400 truncate">{{ user.email }}</p>
            </div>
            <!-- Role badge -->
            <UBadge
              :label="roleLabel[user.role] ?? user.role"
              :color="roleBadgeColor[user.role] ?? 'neutral'"
              variant="subtle"
              size="sm"
            />
          </div>
        </div>

        <!-- Footer count -->
        <div class="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
          Menampilkan {{ filteredUsers.length }} dari {{ adminStore.users.length }} pengguna
        </div>
      </div>

      <!-- Amalan injector -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div class="h-1" style="background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300));" />
        <div class="p-6">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-clipboard-plus" class="w-4.5 h-4.5" style="color: var(--color-burgundy-600);" />
            <h2 class="text-sm font-semibold text-slate-800">Tambah Amalan Master</h2>
          </div>
          <p class="text-xs text-slate-400 mb-5">
            Amalan yang ditambahkan di sini akan tersedia untuk semua pengguna.
          </p>

          <form class="space-y-4" @submit.prevent="handleAddAmalan">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Nama Amalan</label>
              <UInput
                v-model="amalanName"
                placeholder="cth: Sholat Dhuha, Tilawah Al-Quran"
                icon="i-lucide-book-open"
                required
                class="w-full"
              />
            </div>

            <div
              class="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all"
              :style="amalanIsDefault
                ? 'background-color: var(--color-burgundy-50); border: 1.5px solid var(--color-burgundy-200);'
                : 'background-color: #f8fafc; border: 1.5px solid #e2e8f0;'"
              @click="amalanIsDefault = !amalanIsDefault"
            >
              <div>
                <p class="text-sm font-semibold" :style="amalanIsDefault ? `color: var(--color-burgundy-700);` : 'color: #475569;'">
                  Amalan Default
                </p>
                <p class="text-xs mt-0.5 text-slate-400">Otomatis masuk ke tracker semua anggota baru</p>
              </div>
              <!-- Toggle -->
              <div
                class="w-10 h-6 rounded-full p-0.5 transition-all duration-200 shrink-0"
                :style="amalanIsDefault ? `background-color: var(--color-burgundy-600);` : 'background-color: #cbd5e1;'"
              >
                <div
                  class="w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  :class="amalanIsDefault ? 'translate-x-4' : 'translate-x-0'"
                />
              </div>
            </div>

            <UButton
              type="submit"
              block
              color="primary"
              icon="i-lucide-plus"
              label="Tambah ke Master List"
              :loading="adminStore.amalanLoading"
            />
          </form>

          <!-- Info notice -->
          <div
            class="mt-4 p-3 rounded-xl text-xs flex items-start gap-2"
            style="background-color: var(--color-gold-50); color: var(--color-gold-800); border: 1px solid var(--color-gold-200);"
          >
            <UIcon name="i-lucide-zap" class="w-3.5 h-3.5 shrink-0 mt-0.5" style="color: var(--color-gold-600);" />
            <p>Amalan default akan langsung muncul di tracker semua anggota aktif. Non-default hanya tersedia sebagai pilihan.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// ── Role-based navigation ────────────────────────────────────────────────
const memberNav = [
  { label: 'Tracker Harian', icon: 'i-lucide-clipboard-check', to: '/' },
  { label: 'Profil Saya', icon: 'i-lucide-user-circle', to: '/profil' }
]

const teacherNav = [
  { label: 'Kelompok Saya', icon: 'i-lucide-users', to: '/' },
  { label: 'Laporan', icon: 'i-lucide-bar-chart-3', to: '/laporan' },
  { label: 'Pengumuman', icon: 'i-lucide-megaphone', to: '/pengumuman' }
]

const adminNav = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Pengguna', icon: 'i-lucide-users', to: '/pengguna' },
  { label: 'Amalan Master', icon: 'i-lucide-book-open', to: '/amalans' },
  { label: 'Laporan Global', icon: 'i-lucide-bar-chart-3', to: '/laporan' },
  { label: 'Pengaturan', icon: 'i-lucide-settings', to: '/pengaturan' }
]

const navItems = computed(() => {
  if (authStore.isAdmin) return adminNav
  if (authStore.isTeacher) return teacherNav
  return memberNav
})

const roleLabel = computed(() => {
  if (authStore.isAdmin) return 'Super Admin'
  if (authStore.isTeacher) return 'Guru'
  if (authStore.user?.role === 'LEADER') return 'Ketua Kelompok'
  return 'Anggota'
})

const roleIcon = computed(() => {
  if (authStore.isAdmin) return 'i-lucide-shield-check'
  if (authStore.isTeacher) return 'i-lucide-graduation-cap'
  if (authStore.user?.role === 'LEADER') return 'i-lucide-crown'
  return 'i-lucide-user'
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <aside
    class="flex flex-col w-64 min-h-screen shrink-0"
    style="background: linear-gradient(180deg, var(--color-burgundy-900) 0%, var(--color-burgundy-800) 100%);"
  >
    <!-- Logo area -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style="background-color: var(--color-gold-500);"
      >
        <UIcon name="i-lucide-book-open-check" class="w-5 h-5 text-white" />
      </div>
      <div>
        <p class="text-sm font-bold leading-tight" style="color: var(--color-gold-400);">Mutaba'ah</p>
        <p class="text-xs leading-tight" style="color: rgba(255,255,255,0.45);">
          {{ roleLabel }}
        </p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <p class="px-3 pt-2 pb-1.5 text-xs font-semibold uppercase tracking-widest" style="color: rgba(255,255,255,0.3);">
        Menu
      </p>

      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        :class="isActive(item.to)
          ? 'text-white'
          : 'text-white/55 hover:text-white hover:bg-white/8'"
        :style="isActive(item.to)
          ? 'background-color: var(--color-burgundy-600);'
          : ''"
      >
        <UIcon :name="item.icon" class="w-4.5 h-4.5 shrink-0" />
        <span>{{ item.label }}</span>

        <!-- Active indicator -->
        <span
          v-if="isActive(item.to)"
          class="ml-auto w-1 h-4 rounded-full shrink-0"
          style="background-color: var(--color-gold-500);"
        />
      </NuxtLink>
    </nav>

    <!-- User info + logout -->
    <div class="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
      <!-- User card -->
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg">
        <UAvatar
          :text="(authStore.user?.name ?? 'U').slice(0, 2).toUpperCase()"
          size="sm"
          :ui="{ fallback: 'font-semibold text-xs' }"
          :style="`background-color: var(--color-gold-600); color: white;`"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ authStore.user?.name ?? 'Pengguna' }}</p>
          <div class="flex items-center gap-1">
            <UIcon :name="roleIcon" class="w-3 h-3 shrink-0" style="color: var(--color-gold-400);" />
            <p class="text-xs truncate" style="color: rgba(255,255,255,0.45);">{{ authStore.user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Logout -->
      <button
        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
        style="color: rgba(255,255,255,0.5);"
        @mouseenter="(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'"
        @mouseleave="(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'"
        @click="handleLogout"
      >
        <UIcon name="i-lucide-log-out" class="w-4 h-4 shrink-0" />
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

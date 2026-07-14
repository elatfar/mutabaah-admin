<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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
  <aside class="flex flex-col w-64 min-h-screen shrink-0 relative" style="background-color: var(--color-burgundy-900);">

    <!-- Subtle top glow -->
    <div
      class="absolute top-0 left-0 right-0 h-32 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% -20%, rgba(212,175,55,0.15) 0%, transparent 70%);"
    />

    <!-- Logo -->
    <div class="relative flex items-center gap-3 px-5 py-5">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
        style="background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-700));"
      >
        <UIcon name="i-lucide-book-open-check" class="w-5 h-5 text-white" />
      </div>
      <div>
        <p class="text-base font-bold leading-none" style="color: var(--color-gold-400);">Mutaba'ah</p>
        <p class="text-xs leading-none mt-1 font-medium" style="color: rgba(255,255,255,0.35);">{{ roleLabel }}</p>
      </div>
    </div>

    <!-- Divider -->
    <div class="mx-5 h-px" style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);" />

    <!-- Navigation -->
    <nav class="relative flex-1 px-3 pt-4 pb-2">
      <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em]" style="color: rgba(255,255,255,0.22);">
        Navigasi
      </p>

      <div class="space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative"
          :class="isActive(item.to) ? 'text-white' : 'text-white/50 hover:text-white/80'"
          :style="isActive(item.to)
            ? 'background: rgba(255,255,255,0.1);'
            : 'background: transparent;'"
        >
          <!-- Active left bar -->
          <div
            v-if="isActive(item.to)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
            style="background-color: var(--color-gold-400);"
          />

          <!-- Icon container -->
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
            :style="isActive(item.to)
              ? 'background-color: rgba(212,175,55,0.2);'
              : 'background-color: rgba(255,255,255,0.06);'"
          >
            <UIcon
              :name="item.icon"
              class="w-4 h-4 transition-all"
              :style="isActive(item.to) ? 'color: var(--color-gold-400);' : 'color: rgba(255,255,255,0.5);'"
            />
          </div>

          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Divider -->
    <div class="mx-5 h-px" style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);" />

    <!-- User section -->
    <div class="px-3 py-4">
      <!-- User info -->
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1" style="background: rgba(255,255,255,0.05);">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
          style="background: linear-gradient(135deg, var(--color-gold-600), var(--color-gold-800));"
        >
          {{ (authStore.user?.name ?? 'U').slice(0, 2).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate leading-none">{{ authStore.user?.name ?? 'Pengguna' }}</p>
          <p class="text-xs truncate mt-0.5 leading-none" style="color: rgba(255,255,255,0.4);">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <!-- Logout -->
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-white/5"
        style="color: rgba(255,255,255,0.4);"
        @click="handleLogout"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background-color: rgba(255,255,255,0.06);">
          <UIcon name="i-lucide-log-out" class="w-4 h-4" />
        </div>
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

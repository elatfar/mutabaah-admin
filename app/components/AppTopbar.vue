<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const breadcrumbMap: Record<string, string> = {
  '/': 'Dashboard',
  '/profil': 'Profil',
  '/laporan': 'Laporan',
  '/pengumuman': 'Pengumuman',
  '/pengguna': 'Pengguna',
  '/amalans': 'Amalan Master',
  '/pengaturan': 'Pengaturan'
}

const pageTitle = computed(() => {
  if (route.path === '/') {
    if (authStore.isAdmin) return 'Dashboard Admin'
    if (authStore.isTeacher) return 'Panel Guru'
    return 'Tracker Harian'
  }
  return breadcrumbMap[route.path] ?? 'Halaman'
})

const today = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">

    <!-- Left -->
    <div class="flex items-center gap-3">
      <div>
        <h1 class="text-base font-bold text-slate-900 leading-none">{{ pageTitle }}</h1>
        <p class="text-xs text-slate-400 mt-0.5 capitalize leading-none">{{ today }}</p>
      </div>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-2">
      <!-- Notification bell -->
      <button
        class="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
        aria-label="Notifikasi"
      >
        <UIcon name="i-lucide-bell" class="w-4.5 h-4.5 text-slate-500" />
        <span
          class="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
          style="background-color: var(--color-burgundy-500);"
        />
      </button>

      <!-- Divider -->
      <div class="w-px h-6 bg-slate-200 mx-1" />

      <!-- User chip -->
      <div
        class="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
      >
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
          style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-500));"
        >
          {{ (authStore.user?.name ?? 'U').slice(0, 2).toUpperCase() }}
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-slate-800 leading-none">{{ authStore.user?.name?.split(' ')[0] ?? 'Pengguna' }}</p>
          <p class="text-xs leading-none mt-0.5" style="color: var(--color-burgundy-500);">{{ authStore.user?.role }}</p>
        </div>
        <UIcon name="i-lucide-chevron-down" class="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
      </div>
    </div>
  </header>
</template>

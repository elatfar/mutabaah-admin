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

const currentPage = computed(() => {
  if (route.path === '/') {
    if (authStore.isAdmin) return 'Dashboard Admin'
    if (authStore.isTeacher) return 'Panel Guru'
    return 'Tracker Harian'
  }
  return breadcrumbMap[route.path] ?? 'Halaman'
})

const today = computed(() =>
  new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
    <!-- Left: Breadcrumb -->
    <div class="flex items-center gap-2 text-sm">
      <span class="text-slate-400 text-xs">Mutaba'ah</span>
      <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5 text-slate-300" />
      <span class="font-semibold text-sm" style="color: var(--color-burgundy-700);">{{ currentPage }}</span>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-1.5">
      <!-- Date pill -->
      <div class="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full mr-1">
        <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
        {{ today }}
      </div>

      <!-- Notifications -->
      <div class="relative">
        <UButton
          icon="i-lucide-bell"
          variant="ghost"
          color="neutral"
          size="sm"
          aria-label="Notifikasi"
        />
        <span
          class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          style="background-color: var(--color-burgundy-500);"
        />
      </div>

      <UDivider orientation="vertical" class="h-5 mx-1" />

      <!-- Avatar + name -->
      <div class="flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded-lg px-2 py-1 transition-colors">
        <UAvatar
          :text="(authStore.user?.name ?? 'U').slice(0, 2).toUpperCase()"
          size="xs"
          :ui="{ fallback: 'font-semibold text-xs' }"
          :style="`background-color: var(--color-burgundy-700); color: white;`"
        />
        <span class="hidden sm:block text-sm font-medium text-slate-700">
          {{ authStore.user?.name?.split(' ')[0] ?? 'Pengguna' }}
        </span>
        <UIcon name="i-lucide-chevron-down" class="w-3.5 h-3.5 text-slate-400" />
      </div>
    </div>
  </header>
</template>

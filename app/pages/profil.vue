<script setup lang="ts">
const authStore = useAuthStore()
useHead({ title: 'Profil — Mutaba\'ah' })
</script>

<template>
  <div class="max-w-xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Profil Saya</h1>
      <p class="mt-1 text-sm text-slate-500">Informasi akun dan identitas Anda.</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="h-0.5" style="background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-400));" />
      <div class="p-6">
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
            style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-500));"
          >
            {{ (authStore.user?.name ?? 'U').slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <p class="text-lg font-bold text-slate-900">{{ authStore.user?.name }}</p>
            <p class="text-sm text-slate-500">{{ authStore.user?.email }}</p>
            <span
              class="inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style="background-color: var(--color-burgundy-100); color: var(--color-burgundy-700);"
            >
              {{ authStore.user?.role === 'LEADER' ? 'Ketua Kelompok' : 'Anggota' }}
            </span>
          </div>
        </div>

        <div class="space-y-0 divide-y divide-slate-100">
          <div v-for="item in [
            { label: 'ID Pengguna', value: `#${authStore.user?.id}`, mono: true },
            { label: 'Nama Lengkap', value: authStore.user?.name },
            { label: 'Email', value: authStore.user?.email },
            { label: 'Peran', value: authStore.user?.role },
          ]" :key="item.label" class="flex items-center justify-between py-3">
            <span class="text-sm text-slate-500">{{ item.label }}</span>
            <span class="text-sm font-semibold text-slate-800" :class="item.mono ? 'font-mono' : ''">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracker shortcut -->
    <NuxtLink
      to="/"
      class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm"
    >
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--color-burgundy-50);">
        <UIcon name="i-lucide-clipboard-check" class="w-5 h-5" style="color: var(--color-burgundy-600);" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-slate-800">Tracker Harian</p>
        <p class="text-xs text-slate-400">Kembali ke daftar amalan hari ini</p>
      </div>
      <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-slate-400" />
    </NuxtLink>
  </div>
</template>

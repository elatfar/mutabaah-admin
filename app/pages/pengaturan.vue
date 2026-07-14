<script setup lang="ts">
const authStore = useAuthStore()
useHead({ title: 'Pengaturan — Mutaba\'ah' })
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Pengaturan</h1>
      <p class="mt-1 text-sm text-slate-500">Kelola preferensi dan informasi akun Anda.</p>
    </div>

    <!-- Profile card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="h-0.5" style="background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-400));" />
      <div class="p-6">
        <h2 class="text-sm font-semibold text-slate-800 mb-4">Informasi Akun</h2>
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
            style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-500));"
          >
            {{ (authStore.user?.name ?? 'U').slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <p class="text-base font-bold text-slate-900">{{ authStore.user?.name }}</p>
            <p class="text-sm text-slate-500">{{ authStore.user?.email }}</p>
            <span
              class="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style="background-color: var(--color-burgundy-100); color: var(--color-burgundy-700);"
            >
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-slate-500 font-medium">ID Pengguna</span>
            <span class="text-slate-800 font-semibold font-mono">#{{ authStore.user?.id }}</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Peran</span>
            <span class="text-slate-800 font-semibold">{{ authStore.user?.role }}</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-slate-500 font-medium">Status</span>
            <span class="text-green-600 font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Aktif
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Coming soon -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100">
          <UIcon name="i-lucide-wrench" class="w-4 h-4 text-slate-400" />
        </div>
        <h2 class="text-sm font-semibold text-slate-600">Fitur lanjutan</h2>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Pengaturan notifikasi, ganti password, dan preferensi tampilan sedang dalam pengembangan.
      </p>
    </div>
  </div>
</template>

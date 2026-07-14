<script setup lang="ts">
const authStore = useAuthStore()
useHead({ title: 'Laporan — Mutaba\'ah' })
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Laporan</h1>
      <p class="mt-1 text-sm text-slate-500">Laporan aktivitas dan progres amalan.</p>
    </div>

    <!-- Teacher: show group report inline -->
    <TeacherPanelView v-if="authStore.isTeacher" />

    <!-- Admin: redirect to dashboard -->
    <div v-else-if="authStore.isAdmin" class="bg-white rounded-2xl border border-slate-200 p-8 text-center">
      <UIcon name="i-lucide-bar-chart-3" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
      <p class="text-sm font-semibold text-slate-600">Laporan Global</p>
      <p class="text-xs text-slate-400 mt-1">Gunakan panel Pengguna untuk melihat data pengguna secara menyeluruh.</p>
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold px-4 py-2 rounded-xl text-white" style="background-color: var(--color-burgundy-700);">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Ke Dashboard
      </NuxtLink>
    </div>

    <!-- Member -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 p-8 text-center">
      <UIcon name="i-lucide-bar-chart-3" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
      <p class="text-sm font-semibold text-slate-600">Laporan pribadi belum tersedia</p>
      <p class="text-xs text-slate-400 mt-1">Fitur laporan personal sedang dalam pengembangan.</p>
    </div>
  </div>
</template>

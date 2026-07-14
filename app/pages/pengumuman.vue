<script setup lang="ts">
useHead({ title: 'Pengumuman — Mutaba\'ah' })
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Pengumuman</h1>
      <p class="mt-1 text-sm text-slate-500">Informasi dan pengumuman terbaru dari administrator.</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background-color: var(--color-burgundy-50);">
        <UIcon name="i-lucide-megaphone" class="w-7 h-7" style="color: var(--color-burgundy-400);" />
      </div>
      <p class="text-sm font-semibold text-slate-600">Belum ada pengumuman</p>
      <p class="text-xs text-slate-400 mt-1">Pengumuman dari admin akan muncul di sini.</p>
    </div>
  </div>
</template>

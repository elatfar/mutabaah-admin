<script setup lang="ts">
const authStore = useAuthStore()

useHead({ title: 'Amalan Master — Mutaba\'ah' })

if (!authStore.isAdmin) {
  await navigateTo('/')
}
</script>

<template>
  <AdminPanelView initial-tab="amalans" />
</template>

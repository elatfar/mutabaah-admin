<script setup lang="ts">
const authStore = useAuthStore()

useHead({ title: 'Pengguna — Mutaba\'ah' })

// Redirect non-admin via middleware-safe navigation
if (!authStore.isAdmin) {
  await navigateTo('/')
}
</script>

<template>
  <AdminPanelView initial-tab="users" />
</template>

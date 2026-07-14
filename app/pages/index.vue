<script setup lang="ts">
const authStore = useAuthStore()

useHead({
  title: computed(() => {
    if (authStore.isAdmin) return 'Dashboard — Mutaba\'ah'
    if (authStore.isTeacher) return 'Panel Guru — Mutaba\'ah'
    return 'Tracker Harian — Mutaba\'ah'
  })
})
</script>

<template>
  <div>
    <AdminPanelView v-if="authStore.isAdmin" />
    <TeacherPanelView v-else-if="authStore.isTeacher" />
    <MemberTrackerView v-else />
  </div>
</template>

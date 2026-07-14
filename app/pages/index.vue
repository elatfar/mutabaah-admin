<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()

useHead({
  title: computed(() => {
    if (authStore.isAdmin) return 'Super Admin — Mutaba\'ah'
    if (authStore.isTeacher) return 'Panel Guru — Mutaba\'ah'
    return 'Tracker Harian — Mutaba\'ah'
  })
})
</script>

<template>
  <div>
    <!-- ADMIN -->
    <AdminPanelView v-if="authStore.isAdmin" />

    <!-- TEACHER -->
    <TeacherPanelView v-else-if="authStore.isTeacher" />

    <!-- MEMBER / LEADER -->
    <MemberTrackerView v-else />
  </div>
</template>

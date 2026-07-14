<script setup lang="ts">
const trackerStore = useTrackerStore()
const authStore = useAuthStore()

onMounted(() => trackerStore.fetchToday())

const today = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

// Progress ring SVG calculation
const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const dashOffset = computed(() =>
  CIRCUMFERENCE - (trackerStore.progressPercent / 100) * CIRCUMFERENCE
)
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--color-burgundy-800);">
          {{ greeting }}, {{ authStore.user?.name?.split(' ')[0] }} 👋
        </h1>
        <p class="mt-1 text-sm text-slate-500 capitalize">{{ today }}</p>
      </div>
      <UBadge
        :label="authStore.user?.role === 'LEADER' ? 'Ketua Kelompok' : 'Anggota'"
        color="primary"
        variant="subtle"
        size="md"
      />
    </div>

    <!-- Progress card -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
    >
      <!-- Gold top accent -->
      <div class="h-1" style="background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300));" />

      <div class="p-6 flex items-center gap-6">
        <!-- Progress ring -->
        <div class="relative shrink-0 w-24 h-24">
          <svg class="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <!-- Background track -->
            <circle cx="50" cy="50" :r="RADIUS" fill="none" stroke="#f1f5f9" stroke-width="10" />
            <!-- Progress arc -->
            <circle
              cx="50" cy="50" :r="RADIUS" fill="none"
              stroke="var(--color-burgundy-500)"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="CIRCUMFERENCE"
              :stroke-dashoffset="dashOffset"
              style="transition: stroke-dashoffset 0.5s ease;"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-xl font-bold" style="color: var(--color-burgundy-700);">
              {{ trackerStore.progressPercent }}%
            </span>
          </div>
        </div>

        <!-- Summary text -->
        <div>
          <h2 class="text-lg font-bold text-slate-800">Progress Hari Ini</h2>
          <p class="mt-1 text-sm text-slate-500">
            <span class="font-semibold" style="color: var(--color-burgundy-600);">{{ trackerStore.completedCount }}</span>
            dari <span class="font-semibold">{{ trackerStore.totalCount }}</span> amalan selesai
          </p>
          <p v-if="trackerStore.progressPercent === 100" class="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
            <UIcon name="i-lucide-party-popper" class="w-3.5 h-3.5" />
            Luar biasa! Semua amalan hari ini terpenuhi 🎉
          </p>
          <p v-else class="mt-2 text-xs text-slate-400">
            {{ trackerStore.totalCount - trackerStore.completedCount }} amalan tersisa
          </p>
        </div>
      </div>
    </div>

    <!-- Amalan checklist -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-800">Daftar Amalan Harian</h2>
        <UButton
          icon="i-lucide-refresh-cw"
          variant="ghost"
          color="neutral"
          size="xs"
          :loading="trackerStore.loading"
          aria-label="Refresh"
          @click="trackerStore.fetchToday()"
        />
      </div>

      <!-- Loading skeleton -->
      <div v-if="trackerStore.loading" class="divide-y divide-slate-50">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-6 py-4">
          <div class="w-6 h-6 rounded-md bg-slate-100 animate-pulse" />
          <div class="flex-1 h-4 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="trackerStore.amalans.length === 0" class="py-16 text-center">
        <UIcon name="i-lucide-clipboard-x" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p class="text-sm font-medium text-slate-400">Belum ada amalan untuk hari ini</p>
        <p class="text-xs text-slate-300 mt-1">Hubungi guru Anda untuk menambahkan amalan.</p>
      </div>

      <!-- Amalan list -->
      <div v-else class="divide-y divide-slate-50">
        <label
          v-for="item in trackerStore.amalans"
          :key="item.amalanId"
          class="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors group"
        >
          <!-- Custom checkbox -->
          <div class="relative shrink-0">
            <input
              type="checkbox"
              class="sr-only"
              :checked="item.isCompleted"
              @change="trackerStore.toggle(item.amalanId, item.isCompleted)"
            />
            <div
              class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200"
              :style="item.isCompleted
                ? 'background-color: var(--color-burgundy-600); border-color: var(--color-burgundy-600);'
                : 'border-color: #cbd5e1; background-color: white;'"
            >
              <Transition name="check">
                <UIcon
                  v-if="item.isCompleted"
                  name="i-lucide-check"
                  class="w-3.5 h-3.5 text-white"
                />
              </Transition>
            </div>
          </div>

          <!-- Amalan name -->
          <span
            class="flex-1 text-sm font-medium transition-all duration-200"
            :class="item.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'"
          >
            {{ item.amalanName }}
          </span>

          <!-- Completed badge -->
          <Transition name="fade">
            <UBadge
              v-if="item.isCompleted"
              label="Selesai"
              color="success"
              variant="subtle"
              size="sm"
            />
          </Transition>
        </label>
      </div>
    </div>

    <!-- Motivational footer -->
    <div
      class="p-4 rounded-xl text-center text-sm"
      style="background-color: var(--color-burgundy-50); color: var(--color-burgundy-700);"
    >
      <UIcon name="i-lucide-quote" class="w-4 h-4 mx-auto mb-1 opacity-50" />
      <p class="italic text-xs">
        "Amalan yang paling dicintai Allah adalah yang paling konsisten dilakukan, meskipun sedikit."
      </p>
      <p class="text-xs mt-1 opacity-60">— HR. Bukhari & Muslim</p>
    </div>
  </div>
</template>

<style scoped>
.check-enter-active { transition: all 0.15s ease; }
.check-enter-from { opacity: 0; transform: scale(0.5); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

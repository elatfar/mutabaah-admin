<script setup lang="ts">
const trackerStore = useTrackerStore()
const authStore = useAuthStore()

onMounted(() => trackerStore.fetchToday())

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const todayFull = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

// Progress ring
const RADIUS = 38
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const dashOffset = computed(() =>
  CIRCUMFERENCE - (trackerStore.progressPercent / 100) * CIRCUMFERENCE
)

// Add personal amalan
const showAddForm = ref(false)
const newAmalanName = ref('')

async function handleAddAmalan() {
  if (!newAmalanName.value.trim()) return
  try {
    await trackerStore.addPersonalAmalan(newAmalanName.value.trim())
    newAmalanName.value = ''
    showAddForm.value = false
  }
  catch { /* toasted */ }
}
</script>

<template>
  <div class="max-w-xl mx-auto space-y-5">

    <!-- Greeting hero banner -->
    <div
      class="relative overflow-hidden rounded-2xl p-6"
      style="background: linear-gradient(135deg, var(--color-burgundy-800) 0%, var(--color-burgundy-600) 100%);"
    >
      <div class="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10" style="background: var(--color-gold-400);" />
      <div class="absolute right-10 bottom-0 w-28 h-28 rounded-full opacity-10" style="background: var(--color-gold-300);" />

      <div class="relative flex items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-medium capitalize" style="color: rgba(255,255,255,0.6);">{{ todayFull }}</p>
          <h1 class="text-xl font-bold text-white mt-1">{{ greeting }}, {{ authStore.user?.name?.split(' ')[0] }} 👋</h1>
          <p class="text-sm mt-2" style="color: rgba(255,255,255,0.7);">
            <span class="font-bold text-white">{{ trackerStore.completedCount }}</span>
            dari <span class="font-bold text-white">{{ trackerStore.totalCount }}</span> amalan selesai
          </p>
        </div>

        <!-- Progress ring -->
        <div class="relative shrink-0 w-20 h-20">
          <svg class="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" :r="RADIUS" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="9" />
            <circle
              cx="50" cy="50" :r="RADIUS" fill="none"
              :stroke="trackerStore.progressPercent === 100 ? '#4ade80' : 'white'"
              stroke-width="9" stroke-linecap="round"
              :stroke-dasharray="CIRCUMFERENCE"
              :stroke-dashoffset="dashOffset"
              style="transition: stroke-dashoffset 0.6s ease;"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-lg font-bold text-white">{{ trackerStore.progressPercent }}%</span>
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="relative mt-4 h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.15);">
        <div
          class="h-full rounded-full transition-all duration-700 ease-out"
          :style="`width: ${trackerStore.progressPercent}%; background: linear-gradient(90deg, var(--color-gold-400), var(--color-gold-300));`"
        />
      </div>
    </div>

    <!-- Checklist card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background-color: var(--color-burgundy-50);">
            <UIcon name="i-lucide-list-checks" class="w-4 h-4" style="color: var(--color-burgundy-600);" />
          </div>
          <span class="text-sm font-semibold text-slate-800">Amalan Hari Ini</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-2 py-1 rounded-lg" style="background-color: var(--color-burgundy-50); color: var(--color-burgundy-600);">
            {{ trackerStore.completedCount }}/{{ trackerStore.totalCount }}
          </span>
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            aria-label="Refresh"
            @click="trackerStore.fetchToday()"
          >
            <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5 text-slate-400" :class="trackerStore.loading ? 'animate-spin' : ''" />
          </button>
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            :style="showAddForm ? 'background-color: var(--color-burgundy-100);' : 'background-color: transparent;'"
            :class="showAddForm ? '' : 'hover:bg-slate-100'"
            aria-label="Tambah amalan"
            @click="showAddForm = !showAddForm"
          >
            <UIcon
              :name="showAddForm ? 'i-lucide-x' : 'i-lucide-plus'"
              class="w-3.5 h-3.5"
              :style="showAddForm ? 'color: var(--color-burgundy-700);' : 'color: #64748b;'"
            />
          </button>
        </div>
      </div>

      <!-- Add personal amalan form -->
      <Transition name="slide-down">
        <div v-if="showAddForm" class="px-5 py-3 border-b border-slate-100" style="background-color: var(--color-burgundy-50);">
          <form class="flex gap-2" @submit.prevent="handleAddAmalan">
            <UInput
              v-model="newAmalanName"
              placeholder="Nama amalan personal Anda..."
              icon="i-lucide-sparkles"
              size="sm"
              class="flex-1"
              required
            />
            <button
              type="submit"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              style="background-color: var(--color-burgundy-700);"
              :disabled="trackerStore.addingAmalan"
            >
              <UIcon v-if="trackerStore.addingAmalan" name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
              <span v-else>Tambah</span>
            </button>
          </form>
          <p class="text-xs text-slate-500 mt-1.5">Amalan ini hanya terlihat oleh Anda.</p>
        </div>
      </Transition>

      <!-- Loading skeleton -->
      <div v-if="trackerStore.loading" class="divide-y divide-slate-50">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-5 py-4">
          <div class="w-5 h-5 rounded-md bg-slate-100 animate-pulse shrink-0" />
          <div class="flex-1 h-4 rounded-full bg-slate-100 animate-pulse" style="width: 55%;" />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="trackerStore.amalans.length === 0" class="py-12 flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background-color: var(--color-burgundy-50);">
          <UIcon name="i-lucide-clipboard-x" class="w-6 h-6" style="color: var(--color-burgundy-300);" />
        </div>
        <div class="text-center">
          <p class="text-sm font-semibold text-slate-600">Belum ada amalan hari ini</p>
          <p class="text-xs text-slate-400 mt-1">Tambah amalan personal atau hubungi guru Anda.</p>
        </div>
      </div>

      <!-- Amalan list -->
      <div v-else class="divide-y divide-slate-50">
        <label
          v-for="item in trackerStore.amalans"
          :key="item.amalanId"
          class="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
          :class="item.isCompleted ? 'bg-slate-50/60' : 'hover:bg-slate-50/80'"
        >
          <div
            class="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
            :style="item.isCompleted
              ? 'background-color: var(--color-burgundy-600); border-color: var(--color-burgundy-600);'
              : 'border-color: #d1d5db; background: white;'"
          >
            <input type="checkbox" class="sr-only" :checked="item.isCompleted" @change="trackerStore.toggle(item.amalanId, item.isCompleted)" />
            <Transition name="pop">
              <svg v-if="item.isCompleted" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </Transition>
          </div>

          <span
            class="flex-1 text-sm transition-all duration-200"
            :class="item.isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-700 font-medium'"
          >
            {{ item.amalanName }}
          </span>

          <!-- null id = not yet toggled today, show subtle indicator -->
          <span
            v-if="item.id === null && !item.isCompleted"
            class="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"
          />
          <Transition name="fade">
            <svg v-if="item.isCompleted" class="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </Transition>
        </label>
      </div>

      <!-- All done banner -->
      <Transition name="fade">
        <div
          v-if="trackerStore.progressPercent === 100 && trackerStore.totalCount > 0"
          class="px-5 py-4 flex items-center gap-3 border-t border-green-100"
          style="background-color: #f0fdf4;"
        >
          <UIcon name="i-lucide-party-popper" class="w-5 h-5 text-green-600 shrink-0" />
          <p class="text-sm font-semibold text-green-700">Luar biasa! Semua amalan hari ini terpenuhi 🎉</p>
        </div>
      </Transition>
    </div>

    <!-- Role badge for leader -->
    <div v-if="authStore.isLeader" class="rounded-2xl p-4 border flex items-center gap-3" style="background-color: #eff6ff; border-color: #bfdbfe;">
      <UIcon name="i-lucide-crown" class="w-4.5 h-4.5 shrink-0" style="color: #2563eb;" />
      <p class="text-sm text-blue-700">
        Anda adalah <strong>Ketua Kelompok</strong>. Laporan kelompok tersedia di panel guru.
      </p>
    </div>

    <!-- Hadith -->
    <div class="rounded-2xl p-4 border" style="background-color: var(--color-burgundy-50); border-color: var(--color-burgundy-100);">
      <div class="flex gap-3">
        <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style="background-color: var(--color-gold-100);">
          <UIcon name="i-lucide-quote" class="w-3.5 h-3.5" style="color: var(--color-gold-700);" />
        </div>
        <div>
          <p class="text-sm italic leading-relaxed" style="color: var(--color-burgundy-800);">
            "Amalan yang paling dicintai Allah adalah yang paling konsisten dilakukan, meskipun sedikit."
          </p>
          <p class="text-xs mt-1.5 font-medium" style="color: var(--color-burgundy-500);">HR. Bukhari & Muslim</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active { transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { opacity: 0; transform: scale(0.3); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

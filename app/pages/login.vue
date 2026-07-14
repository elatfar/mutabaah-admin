<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'auth' })
useHead({ title: 'Masuk — Mutaba\'ah' })

const authStore = useAuthStore()
const router = useRouter()

// Tab state: 'login' | 'register'
const activeTab = ref<'login' | 'register'>('login')

// Form states
const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ name: '', email: '', password: '', role: 'MEMBER' as 'MEMBER' | 'TEACHER' })
const showPassword = ref(false)

const roleOptions = [
  { label: 'Anggota (Member)', value: 'MEMBER' },
  { label: 'Guru (Teacher)', value: 'TEACHER' }
]

async function handleLogin() {
  try {
    await authStore.login(loginForm.email, loginForm.password)
    await router.push('/')
  }
  catch { /* error shown via store */ }
}

async function handleRegister() {
  try {
    await authStore.register(
      registerForm.name,
      registerForm.email,
      registerForm.password,
      registerForm.role
    )
    await router.push('/')
  }
  catch { /* error shown via store */ }
}
</script>

<template>
  <!-- Card with gold top border -->
  <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
    <!-- Gold accent bar -->
    <div class="h-1.5 w-full" style="background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300), var(--color-gold-500));" />

    <div class="px-8 pt-8 pb-10">
      <!-- Logo & title -->
      <div class="text-center mb-8">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style="background: linear-gradient(135deg, var(--color-burgundy-700), var(--color-burgundy-500));"
        >
          <UIcon name="i-lucide-book-open-check" class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold" style="color: var(--color-burgundy-800);">Mutaba'ah</h1>
        <p class="mt-1 text-sm text-slate-500">Sistem Pencatatan Amalan Harian</p>
      </div>

      <!-- Tab switcher -->
      <div class="flex rounded-xl p-1 mb-6 bg-slate-100">
        <button
          class="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
          :class="activeTab === 'login'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'"
          @click="activeTab = 'login'"
        >
          Masuk
        </button>
        <button
          class="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
          :class="activeTab === 'register'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'"
          @click="activeTab = 'register'"
        >
          Daftar
        </button>
      </div>

      <!-- Error banner -->
      <Transition name="fade">
        <div
          v-if="authStore.error"
          class="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm"
          style="background-color: var(--color-burgundy-50); color: var(--color-burgundy-700); border: 1px solid var(--color-burgundy-200);"
        >
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
          {{ authStore.error }}
        </div>
      </Transition>

      <!-- LOGIN FORM -->
      <Transition name="slide" mode="out-in">
        <form v-if="activeTab === 'login'" key="login" class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <UInput
              v-model="loginForm.email"
              type="email"
              placeholder="nama@email.com"
              icon="i-lucide-mail"
              size="lg"
              required
              autocomplete="email"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <UInput
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              icon="i-lucide-lock"
              :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              size="lg"
              required
              autocomplete="current-password"
              class="w-full"
              @click:trailing="showPassword = !showPassword"
            />
          </div>

          <UButton
            type="submit"
            block
            size="lg"
            color="primary"
            :loading="authStore.loading"
            class="mt-2 font-semibold"
          >
            Masuk ke Dashboard
          </UButton>
        </form>

        <!-- REGISTER FORM -->
        <form v-else key="register" class="space-y-4" @submit.prevent="handleRegister">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
            <UInput
              v-model="registerForm.name"
              type="text"
              placeholder="Nama lengkap"
              icon="i-lucide-user"
              size="lg"
              required
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="nama@email.com"
              icon="i-lucide-mail"
              size="lg"
              required
              autocomplete="email"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <UInput
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Minimal 8 karakter"
              icon="i-lucide-lock"
              :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              size="lg"
              required
              minlength="8"
              autocomplete="new-password"
              class="w-full"
              @click:trailing="showPassword = !showPassword"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Daftar sebagai</label>
            <USelect
              v-model="registerForm.role"
              :items="roleOptions"
              value-key="value"
              label-key="label"
              size="lg"
              class="w-full"
            />
          </div>

          <UButton
            type="submit"
            block
            size="lg"
            color="primary"
            :loading="authStore.loading"
            class="mt-2 font-semibold"
          >
            Buat Akun
          </UButton>
        </form>
      </Transition>

      <p class="mt-6 text-center text-xs text-slate-400">
        Dengan masuk, Anda menyetujui ketentuan penggunaan sistem Mutaba'ah.
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from { opacity: 0; transform: translateX(12px); }
.slide-leave-to { opacity: 0; transform: translateX(-12px); }
</style>

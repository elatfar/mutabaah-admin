<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Masuk — Mutaba\'ah' })

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'login' | 'register'>('login')
const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'MEMBER' as 'MEMBER' | 'TEACHER' | 'ADMIN' | 'LEADER'
})
const showPassword = ref(false)
const registerSuccess = ref(false)
const registerName = ref('')

const roleOptions = [
  { label: 'Anggota (Member)', value: 'MEMBER' },
  { label: 'Ketua Kelompok (Leader)', value: 'LEADER' },
  { label: 'Guru (Teacher)', value: 'TEACHER' },
  { label: 'Super Admin', value: 'ADMIN' }
]

function switchTab(tab: 'login' | 'register') {
  activeTab.value = tab
  authStore.error = null
  registerSuccess.value = false
}

async function handleLogin() {
  try {
    await authStore.login(loginForm.email, loginForm.password)
    await router.push('/')
  }
  catch { /* handled in store */ }
}

async function handleRegister() {
  try {
    const res = await authStore.register(
      registerForm.name,
      registerForm.email,
      registerForm.password,
      registerForm.role
    )
    registerName.value = registerForm.name
    registerSuccess.value = true
    // Reset form
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.role = 'MEMBER'
    void res
  }
  catch { /* handled in store */ }
}
</script>

<template>
  <div>
    <!-- Mobile logo -->
    <div class="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-700));">
        <UIcon name="i-lucide-book-open-check" class="w-5 h-5 text-white" />
      </div>
      <span class="text-xl font-bold text-white">Mutaba'ah</span>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div class="h-1" style="background: linear-gradient(90deg, var(--color-gold-700), var(--color-gold-400), var(--color-gold-700));" />

      <div class="p-7 sm:p-8">
        <!-- Heading -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-slate-900">
            {{ activeTab === 'login' ? 'Selamat datang' : 'Buat akun baru' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ activeTab === 'login' ? 'Masuk ke sistem Mutaba\'ah' : 'Daftarkan akun Anda — admin akan mengaktifkan setelah verifikasi' }}
          </p>
        </div>

        <!-- Tab switcher -->
        <div class="flex rounded-xl p-1 mb-6" style="background-color: var(--color-burgundy-50);">
          <button
            class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            :style="activeTab === 'login'
              ? 'background-color: var(--color-burgundy-700); color: white; box-shadow: 0 2px 6px rgba(128,0,32,0.25);'
              : 'color: var(--color-burgundy-400);'"
            @click="switchTab('login')"
          >
            Masuk
          </button>
          <button
            class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            :style="activeTab === 'register'
              ? 'background-color: var(--color-burgundy-700); color: white; box-shadow: 0 2px 6px rgba(128,0,32,0.25);'
              : 'color: var(--color-burgundy-400);'"
            @click="switchTab('register')"
          >
            Daftar
          </button>
        </div>

        <!-- Error banner -->
        <Transition name="fade">
          <div
            v-if="authStore.error"
            class="mb-5 p-4 rounded-xl flex items-start gap-3 text-sm border"
            :style="authStore.error.includes('belum diaktifkan')
              ? 'background-color: #fffbeb; color: #92400e; border-color: #fde68a;'
              : 'background-color: #fff1f2; color: #9f1239; border-color: #fecdd3;'"
          >
            <UIcon
              :name="authStore.error.includes('belum diaktifkan') ? 'i-lucide-clock' : 'i-lucide-circle-x'"
              class="w-5 h-5 shrink-0 mt-0.5"
            />
            <div>
              <span>{{ authStore.error }}</span>
              <p v-if="authStore.error.includes('belum diaktifkan')" class="text-xs mt-1 opacity-75">
                Cek kembali setelah mendapat konfirmasi dari administrator.
              </p>
            </div>
          </div>
        </Transition>

        <!-- Register success -->
        <Transition name="fade">
          <div
            v-if="registerSuccess"
            class="mb-5 p-4 rounded-xl border text-sm"
            style="background-color: #f0fdf4; color: #166534; border-color: #bbf7d0;"
          >
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
              <div>
                <p class="font-semibold">Pendaftaran berhasil, {{ registerName }}! 🎉</p>
                <p class="text-xs mt-1 opacity-80">
                  Akun Anda sedang menunggu aktivasi dari administrator. Silakan masuk setelah akun diaktifkan.
                </p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Forms -->
        <Transition name="slide" mode="out-in">

          <!-- LOGIN -->
          <form v-if="activeTab === 'login'" key="login" class="space-y-5" @submit.prevent="handleLogin">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Email</label>
              <UInput
                v-model="loginForm.email"
                type="email"
                placeholder="nama@email.com"
                icon="i-lucide-mail"
                size="lg"
                required
                autocomplete="email"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Password</label>
              <UInput
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-lock-keyhole"
                :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                size="lg"
                required
                autocomplete="current-password"
                @click:trailing="showPassword = !showPassword"
              />
            </div>

            <UButton type="submit" block size="lg" color="primary" :loading="authStore.loading" class="font-semibold">
              Masuk ke Dashboard
            </UButton>
          </form>

          <!-- REGISTER -->
          <form v-else key="register" class="space-y-4" @submit.prevent="handleRegister">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
              <UInput v-model="registerForm.name" placeholder="Nama lengkap Anda" icon="i-lucide-user" size="lg" required />
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Email</label>
              <UInput v-model="registerForm.email" type="email" placeholder="nama@email.com" icon="i-lucide-mail" size="lg" required autocomplete="email" />
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Password</label>
              <UInput
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
                icon="i-lucide-lock-keyhole"
                :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                size="lg"
                required
                minlength="8"
                autocomplete="new-password"
                @click:trailing="showPassword = !showPassword"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Daftar sebagai</label>
              <USelect v-model="registerForm.role" :items="roleOptions" value-key="value" label-key="label" size="lg" />
            </div>

            <!-- Info notice -->
            <div class="flex items-start gap-2.5 p-3 rounded-xl text-xs" style="background-color: #fffbeb; border: 1px solid #fde68a; color: #92400e;">
              <UIcon name="i-lucide-info" class="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>Akun baru perlu diaktifkan oleh admin sebelum bisa login. Secara default semua akun berstatus <strong>INACTIVE</strong>.</p>
            </div>

            <UButton type="submit" block size="lg" color="primary" :loading="authStore.loading" class="font-semibold">
              Daftarkan Akun
            </UButton>
          </form>
        </Transition>
      </div>

      <div class="px-8 py-3.5 border-t border-slate-100" style="background-color: #fafafa;">
        <p class="text-center text-xs text-slate-400">
          Sistem Mutaba'ah &copy; {{ new Date().getFullYear() }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.slide-enter-from { opacity: 0; transform: translateX(16px); }
.slide-leave-to { opacity: 0; transform: translateX(-16px); }
</style>

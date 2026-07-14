<template>
  <div class="min-h-screen relative overflow-hidden font-sans" style="background-color: var(--color-burgundy-900);">

    <!-- Layered background texture -->
    <div class="absolute inset-0">
      <!-- Large ambient circle top-right -->
      <div
        class="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);"
      />
      <!-- Subtle circle bottom-left -->
      <div
        class="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
        style="background: radial-gradient(circle, rgba(128,0,32,0.5) 0%, transparent 70%);"
      />
      <!-- Grid pattern overlay -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: linear-gradient(var(--color-gold-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold-400) 1px, transparent 1px); background-size: 40px 40px;"
      />
    </div>

    <!-- Split layout -->
    <div class="relative min-h-screen flex">

      <!-- Left panel — branding (hidden on mobile) -->
      <div class="hidden lg:flex flex-col justify-between w-[45%] p-12 xl:p-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            style="background-color: var(--color-gold-500);"
          >
            <svg class="w-5 h-5 text-white fill-white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" /></svg>
          </div>
          <span class="text-lg font-bold" style="color: var(--color-gold-400);">Mutaba'ah</span>
        </div>

        <!-- Main copy -->
        <div>
          <h1 class="text-4xl xl:text-5xl font-extrabold leading-tight text-white">
            Konsisten dalam<br />
            <span style="color: var(--color-gold-400);">kebaikan</span> setiap<br />
            hari.
          </h1>
          <p class="mt-5 text-base leading-relaxed" style="color: rgba(255,255,255,0.5);">
            Sistem pencatatan amalan harian yang membantu Anda, guru, dan kelompok saling mengingatkan untuk tetap istiqomah.
          </p>

          <!-- Features -->
          <div class="mt-8 space-y-3">
            <div v-for="f in ['Tracker amalan harian personal', 'Monitoring kelompok oleh guru', 'Laporan progres & konsistensi']" :key="f" class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style="background-color: rgba(212,175,55,0.2);">
                <svg class="w-3 h-3" style="color: var(--color-gold-400);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span class="text-sm" style="color: rgba(255,255,255,0.65);">{{ f }}</span>
            </div>
          </div>
        </div>

        <!-- Footer quote -->
        <div class="border-l-2 pl-4" style="border-color: var(--color-gold-700);">
          <p class="text-sm italic" style="color: rgba(255,255,255,0.4);">
            "Amalan yang paling dicintai Allah adalah yang paling konsisten, meskipun sedikit."
          </p>
          <p class="text-xs mt-1" style="color: rgba(255,255,255,0.25);">HR. Bukhari & Muslim</p>
        </div>
      </div>

      <!-- Right panel — form -->
      <div class="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div class="w-full max-w-[420px]">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

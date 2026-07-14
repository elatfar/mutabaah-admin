<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 font-sans"
    style="background: linear-gradient(135deg, var(--color-burgundy-900) 0%, var(--color-burgundy-700) 60%, var(--color-burgundy-800) 100%);"
  >
    <!-- Decorative background circles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
        style="background: radial-gradient(circle, var(--color-gold-400), transparent);"
      />
      <div
        class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10"
        style="background: radial-gradient(circle, var(--color-gold-500), transparent);"
      />
    </div>

    <div class="relative w-full max-w-md">
      <slot />
    </div>
  </div>
</template>

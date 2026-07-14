<template>
  <div class="flex min-h-screen bg-slate-50 font-sans">
    <AppSidebar />
    <div class="flex flex-col flex-1 min-w-0">
      <AppTopbar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

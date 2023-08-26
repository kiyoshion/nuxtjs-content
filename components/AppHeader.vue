<template>
  <header class="fixed top-0 left-0 h-screen text-slate-500 bg-slate-100/75 z-50 backdrop-blur-sm">
    <div class="flex flex-col justify-between my-4">
      <div class="flex items-center justify-center">
        <NuxtLink to="/" class="p-4 block">Logo</NuxtLink>
      </div>
      <div class="flex flex-col">
        <NuxtLink to="/guide" class="p-4 flex items-center"><img src="/img/svg/next.js.svg" class="w-4 h-4 mr-2">guide</NuxtLink>
        <NuxtLink to="/cheatsheet" class="p-4 flex items-center"><img src="/img/svg/next.js.svg" class="w-4 h-4 mr-2">cheatsheet</NuxtLink>
        <NuxtLink to="/error" class="p-4 flex items-center"><img src="/img/svg/next.js.svg" class="w-4 h-4 mr-2">error</NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 10rem;
  z-index: 60;
}
</style>

<template>
  <header :class="`app-header fixed top-0 left-0 h-screen text-slate-500 bg-slate-100 backdrop-blur-sm ${ store.subNav ? 'short' : 'wide'}`">
    <div class="flex flex-col justify-between my-4">
      <div class="flex items-center justify-center">
        <NuxtLink to="/" class="p-2 mb-4 block"><img src="/img/svg/next.js.svg" class="w-4 h-4">
          <span
            v-if="!store.subNav"
            class="ml-2"
          >Logo</span>
        </NuxtLink>
      </div>
      <div class="links flex flex-col">
        <NuxtLink to="/guide" class="p-2 flex items-center"><img src="/img/svg/next.js.svg" class="w-4 h-4">
          <span
            v-if="!store.subNav"
            class="ml-2"
          >guide</span>
        </NuxtLink>
        <NuxtLink to="/cheatsheet" class="p-2 flex items-center"><img src="/img/svg/next.js.svg" class="w-4 h-4">
          <span
            v-if="!store.subNav"
            class="ml-2"
          >cheatsheet</span>
        </NuxtLink>
        <NuxtLink to="/solved" class="p-2 flex items-center"><img src="/img/svg/next.js.svg" class="w-4 h-4">
          <span
            v-if="!store.subNav"
            class="ml-2"
          >solved</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useMainStore } from '@/store'

const store = useMainStore()
</script>

<style scoped>
.app-header {
  transition: all .4s ease-in-out;
}

.app-header.wide {
  width: 140px;
  z-index: 40;
}

.app-header.short {
  justify-content: center;
  width: 60px;
}

.app-header.short .links {
  align-items: center;
}

</style>

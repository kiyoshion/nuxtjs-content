<template>
  <div class="subnav fixed min-h-screen left-20 top-0 flex flex-col my-4 z-50">
    <div
      v-for="list in lists"
      :key="list"
      class="hover:cursor-pointer py-2"
      @click="() => store.$patch({ currentGuideTag: list })"
    >{{list}}</div>
  </div>
</template>

<script setup>
// import { useMainStore } from '@/store'

// const store = useMainStore()
const lists = [
  'All', 'Laravel', 'React', 'Vue'
]
// defineProps({
//   lists: Array
// })
</script>

<style scoped>
.subnav {
  width: 140px;
}
</style>

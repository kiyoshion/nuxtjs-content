<template>
  <div class="bg-slate-100 min-h-screen p-4">
    <div class="p-4 rounded-md bg-white">
      <div class="flex items-center p-4">
        <NuxtLink href="/cheatsheet" class="mr-2">back</NuxtLink>
        <h1 class="text-xl font-bold">{{ cheatsheets[0].tag }} - Cheat Sheet</h1>
      </div>
      <div class="flex flex-row flex-wrap delay-200 mb-4 mx-2">
        <div v-for="cheatsheet in cheatsheets" :key="cheatsheet.title" class="sm:w-1/4 w-full p-1 hover:cursor-pointer hover:opacity-80 duration-75">
          <div
            @click="() => { showModal = true, currentCheatsheet = cheatsheet }"
            class="bg-gray-800 text-gray-100 rounded-md p-4 text-sm"
          >{{ cheatsheet.shortTitle }}</div>
        </div>
      </div>
      <Teleport to="body">
        <CheatsheetModal :show="showModal" @close="showModal = false" >
          <template #header>
            <div class="flex items-center">
              <h3 class="mr-4">{{ currentCheatsheet.title }}</h3>
            </div>
          </template>
          <template #body>
            <ContentDoc :path="currentCheatsheet._path" />
          </template>
        </CheatsheetModal>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const { path } = useRoute()
const target = path.replace('/cheatsheet/', '')
const showModal = ref(false)
const currentCheatsheet = ref({})
const cheatsheets = await queryContent('cheatsheet', target).find();

onMounted(() => {
  console.log(cheatsheets)
})
</script>

<style scoped>
._main-content {
  width: 50vw;
}

</style>

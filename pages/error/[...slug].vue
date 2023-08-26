<template>
  <div class="bg-white min-h-screen">
    <div class="flex items-center p-4">
      <NuxtLink href="/error" class="mr-2">back</NuxtLink>
      <h1 class="text-xl font-bold">{{ errors[0].tag }} - Error message</h1>
    </div>
    <div class="flex flex-row flex-wrap delay-200 mb-4 mx-2">
      <div v-for="error in errors" :key="error.title" class="sm:w-1/4 w-full p-1 hover:cursor-pointer hover:opacity-80 duration-75">
        <div
          @click="() => { showModal = true, currentError = error }"
          class="bg-gray-800 text-gray-100 rounded-md p-4 text-sm"
        >{{ error.shortTitle }}</div>
      </div>
    </div>
    <Teleport to="body">
      <CheatsheetModal :show="showModal" @close="showModal = false" >
        <template #header>
          <div class="flex items-center">
            <h3 class="mr-4">{{ currentError.title }}</h3>
          </div>
        </template>
        <template #body>
          <ContentDoc :path="currentError._path" />
        </template>
      </CheatsheetModal>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const { path } = useRoute()
const target = path.replace('/error/', '')
const showModal = ref(false)
const currentError = ref({})
const errors = await queryContent('error', target).find();

onMounted(() => {
  console.log(errors)
})
</script>

<style scoped>
._main-content {
  width: 50vw;
}

</style>

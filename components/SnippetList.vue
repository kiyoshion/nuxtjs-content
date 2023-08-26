<template>
  <div>
    <div class="flex px-4 py-2">
      <div v-for="(s, i) in snippets" :key="i" class="_card  hover:cursor-pointer ">
        <div @click="() => { showModal = true, currentSnippet = s }" class="h-20 p-2 mr-4 bg-white rounded-md text-xs font-bold text-gray-600 flex items-center justify-center" :key="i">{{ s.shortTitle }}</div>
      </div>
    </div>
    <Teleport to="body">
      <SnippetModal :show="showModal" @close="showModal = false" >
        <template #header>
          <!-- <ContentQuery :path="currentSnippet._path" find="one" v-slot="{data}"> -->
            <div class="flex items-center">
              <h3 class="mr-4">{{ currentSnippet.title }}</h3>
              <div v-for="(tag, i) in currentSnippet.tags" :key="i" class="text-xs">{{ tag }}<span v-if="i + 1 < currentSnippet.tags.length" class="mx-1">/</span>
              </div>
            </div>
          <!-- </ContentQuery> -->
        </template>
        <template #body>
          <ContentDoc :path="currentSnippet._path" />
        </template>
      </SnippetModal>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const showModal = ref(false)
const currentSnippet = ref({})
defineProps({ snippets: Array })
</script>

<style scoped>
._card {
  width: 50%;
  margin: .5rem;
}
</style>

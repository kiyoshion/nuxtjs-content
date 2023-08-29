<template>
  <div class="relative scroll-smooth">
    <div class="_main-content relative p-8 bg-slate-50 min-h-screen">
      <h1 ref="title">{{ page.title }}</h1>
      <h2 ref="step">Steps</h2>
      <!-- <PageToc /> -->
      <ContentRenderer ref="nuxtContent" :key="page._id" :value="page" />
    </div>
    <div>
      <GuideSide :snippets="snippets" />
    </div>
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'
import { watchDebounced } from '@vueuse/core'
import { ref } from 'vue'
const { page } = useContent()
const { path } = useRoute()
const target = path.replace('/guide/', '')
const snippets = await queryContent('snippet').where({ category: target }).find();
const s = ref(snippets)
const currentToc = ref(null)
const observer = ref(null)
</script>

<style scoped>
._main-content {
  width: 50vw;
}

</style>

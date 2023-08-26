<template>
  <div class=" bg-white min-h-screen">
    <div>
      <div v-for="tag in tags" :key="tag">
        <NuxtLink
          :href="`/error/${(tag.replaceAll(' ', '-')).toLowerCase()}`"
          class="py-1 px-2"
        >{{ tag }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  documentDriven: false
})
const currentTag = ref('Git')
const currentError = ref({})
const tags = ref(['Laravel'])
</script>

<style scoped>
.hero {
  height: 50vh;
}
._box {
  width: 25vw;
  height: 25vw;
}
._box-text {
  width: 12.5vw;
}
._guide-content {
  position: absolute;
  width: 66vw;
  top: 0;
  right: 0;
  z-index: 1000;
}

</style>

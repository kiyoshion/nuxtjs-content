<template>
  <nuxt-img :src="`/img/content/${slug}/${name}`" />
</template>

<script setup>
defineProps({
  name: String,
  slug: String,
})
</script>

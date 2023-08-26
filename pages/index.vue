<template>
  <div class="flex">
    <div>
      <div v-for="guide in guides" :key="guide.title">
        <NuxtLink :href="`${guide._path}`">
        {{ guide.title }}
        </NuxtLink>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup>
const guides = await queryContent('guide').only(['title', '_path', 'type', 'tags', 'icon']).limit(3).find();
</script>

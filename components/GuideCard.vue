<template>
  <div v-for="guide in guides" :key="guide.id" class="w-1/4 my-2 mx-1 border rounded-md">
    <NuxtLink :to="guide._path" class="w-full h-full ">
      <div class="flex items-start justify-center ">
        <div class="mt-8">
          <img :src="`/img/svg/${guide.icon}.svg`" class="w-8 h-8" />
        </div>
        <h2 class="px-4 py-8 text-sm leading-5">
          <span class="block">
            <h3 class="font-bold text-lg">{{ guide.icon }}</h3>
            <span v-for="(tag, i) in guide.tags" :key="tag">{{ tag }}
              <span v-if="i < guide.tags.length - 1"> + </span>
            </span>
          </span>
          <span>ではじめる{{ guide.type }}開発</span>
        </h2>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    gudes: {
      type: Array,
    }
  }
}
</script>

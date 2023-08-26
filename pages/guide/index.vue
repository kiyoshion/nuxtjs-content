<template>
  <div class=" bg-white min-h-screen">
    <div class="hero flex flex-col justify-end bg-slate-200 delay-100 relative">
      <img src="/img/bg/nohaco-top.jpg" class="w-1/2" />
      <h1 className="text-xl p-4 absolute bottom-4 left-4">はじめかた大全</h1>
    </div>
    <div class="flex flex-row flex-wrap bg-slate-200 delay-200 p-1">
      <div v-for="guide in guides" :key="guide.id" class="w-1/4 p-2 hover:bg-gray-300 duration-75 bg-white">
        <NuxtLink :to="guide._path" class="w-full h-full block">
          <div class="flex items-start justify-between p-4 py-8 ">
            <div class="w-1/4">
              <img :src="`/img/svg/${guide.icon}.svg`" class="w-8 h-8" />
            </div>
            <h2 class="text-sm leading-5 w-3/4">
              <span class="block">
                <h3 class="font-bold text-lg">{{ guide.title }}</h3>
                <!-- <span v-for="(tag, i) in guide.tags" :key="tag">{{ tag }}
                  <span v-if="i < guide.tags.length - 1"> + </span>
                </span> -->
              </span>
              <!-- <span>ではじめる{{ guide.type }}開発</span> -->
            </h2>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  documentDriven: false
})
const guides = await queryContent('/guide')
  .only(['title', '_path', 'type', 'tags', 'icon'])
  .find()
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

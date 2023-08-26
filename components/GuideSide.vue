<template>
  <div class="_guide-side">
    <div class="_guide-side-inner">
      <div
        v-motion
        :initial="{ x: 50, opacity: 0 }"
        :enter="{ x: 0, opacity: 1, transition: { duration: 400, ease: 'easeInOut' }}"
        :delay="200"
      >
        <div class="_live bg-slate-50 rounded-md" >
          <span class="inline-block text-xs px-2 py-1 ml-2 mt-2 rounded-md bg-rose-400 text-white">LIVE</span>
        </div>
      </div>
    </div>
    <div class="_terminal">
      <div
        v-motion
        :initial="{ x: 50, opacity: 0 }"
        :enter="{ x: 0, opacity: 1, transition: { duration: 400, ease: 'easeInOut' }}"
        :delay="300"
      >
        <div class="_terminal-inner rounded-md">
          <span class="inline-block text-xs px-2 py-1 ml-2 mt-2 rounded-md bg-rose-400 text-white">terminal</span>
        </div>
      </div>
    </div>
    <div
      v-motion
      :initial="{ x: 50, opacity: 0 }"
      :enter="{ x: 0, opacity: 1, transition: { duration: 400, ease: 'easeInOut' }}"
      :delay="400"
    >
      <SnippetList :snippets="snippets" />
    </div>
  </div>
</template>

<script setup>
defineProps({ snippets: Array })

</script>

<style scoped>
._guide-side {
  position: fixed;
  top: 0;
  right: 0;
  width: calc(50vw - 10rem);
  min-height: 100vh;
  color: #d1cdcd;
  /* background-color: rgba(161, 161, 161, 0.75); */
  background-color: rgb(245, 242, 242);
}

._guide-side-inner {
  padding: 2rem 1rem 1rem;
}

._live {
  height: 30vh;
}

._terminal {
  padding: 0rem 1rem 1rem;
}

._terminal-inner {
  background-color: #252342;
  color: #e5e2e2;
  height: 20vh;
}

.slide-1-enter-from,
.slide-1-leave-to {
  opacity: 0;
}

.slide-1-leave-from,
.slide-1-enter-to {
  opacity: 1;
}
</style>

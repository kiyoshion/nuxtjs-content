<template>
  <div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  url: String,
})
const data = ref({})
const getUrl = async () => {
  await fetch('https://qiita.com/ksyunnnn/items/bfe2b9c568e97bb6b494')
    .then(res => res.text())
    .then(text => {
      const el = new DOMParser().parseFromString(text, "text/html")
      const headEls = (el.head.children)
      Array.from(headEls).map(v => {
        const prop = v.getAttribute('property')
        if (!prop) return;
        console.log(prop, v.getAttribute("content"))
      })
})}
onMounted((url) => {
  getUrl(url)
})
</script>

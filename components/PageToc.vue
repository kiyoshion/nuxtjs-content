<template>
  <div>
    <ul v-if="toc && toc.links" class="_toc flex overflow-x-auto -mr-12 "  v-intersection-observer="onIntersectionObserver">
      <li v-for="(link, i) in toc.links" :key="link.text" class="border-r flex-none" >
        <a :href="`#${link.id}`" class="text-xs py-1 px-4 flex items-center" :ref="setLinkWidth">
          <span class="font-sembold mr-2">{{ i + 1 }}</span><span class="leading-4">{{ link.text }}</span>
        </a>
      </li>
    </ul>
    <div class="opacity-0 h-8 top-0 left-0 w-full z-1" ref="topToc"></div>
    <!-- <span v-if="!isVisible" class="fixed top-0 left-34 z-50 p-2" @click="moveTopToc('left')">←</span> -->
    <div v-if="!isVisible"  class="_fixed-toc overflow-x-auto">
      <div class="transition-all duration-100 " ref="topTocInner">
        <ul class="flex  " >
          <li v-for="(link, i) in toc.links" :key="link.text"  class="flex-none inline-block w-1/3 text-center" :class="{'border-b-4 border-green-300': link.id === currentToc }">
            <a :href="`#${link.id}`" class="text-xs pb-2 px-4 flex items-center justify-center">
              <span class="font-sembold mr-2">{{ i + 1 }}</span><span class="leading-4">{{ link.text }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="opacity-0 h-8 top-0 left-0 w-full z-1" ref="topToc"></div>
    <div v-if="!isVisible"  class="_fixed-toc overflow-x-auto">
      <div class="transition-all duration-100" ref="topTocInner">
        <ul class="flex  " >
          <li v-for="(link, i) in toc.links" :key="link.text"  class="flex-none inline-block w-30" :class="{'border-b-4 border-green-300': link.id === currentToc }">
            <a :href="`#${link.id}`" class="text-xs pb-2 px-4 flex items-center w-30">
              <span class="font-sembold mr-2">{{ i + 1 }}</span><span class="leading-4">{{ link.text }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'
import { watchDebounced } from '@vueuse/core'
const { toc } = useContent()
const target = ref(null)
const isVisible = ref(false)
const currentToc = ref(null)
const nuxtContent = ref(null)
const topToc = ref(null)
const topTocInner = ref(null)
const observer = ref(null)
const currentOrder = ref(0)
const marginLeft = ref(null)
let previousY = ref(0)
let previousRatio = ref(0)
let linkWidth = []
const observerOptions = ref({
  root: null,
  rootMargin: '-50%',
  threshold: 0,
})

function onIntersectionObserver([{ isIntersecting }]) {
  isVisible.value = isIntersecting
}

const setLinkWidth = el => { linkWidth.push(el) }

onBeforeUpdate(() => {
  linkWidth = []
})

const moveTopToc = (direction) => {
  if (direction === 'left') {
    marginLeft.value += 33
    topTocInner.value.style.transform = `translateX(${marginLeft.value}%)`
  } else {
    marginLeft.value -= 33
    topTocInner.value.style.transform = `translateX(${marginLeft.value}%)`
  }
}

const changeCurrentToc = (id, oldToc, newToc) => {
  console.log('oldToc', oldToc)
  console.log('newToc', newToc)

  if (oldToc !== -1 && newToc !== -1) {
    if (oldToc > newToc) {
      for (let i = (oldToc - newToc); i > 0; i--) {
        marginLeft.value += 33
      }
    } else if (oldToc < newToc) {
      for (let i = (newToc - oldToc); i > 0; i--) {
        marginLeft.value -= 33
      }
    }
    if (topTocInner.value) {
      topTocInner.value.style.transform = `translateX(${marginLeft.value}%)`
    }
  }
  // if (oldToc !== -1 && newToc !== -1) {
  //   if (oldToc > newToc) {
  //     marginLeft.value += linkWidth[newToc].offsetWidth - 32
  //   } else if (oldToc < newToc) {
  //     marginLeft.value -= linkWidth[newToc].offsetWidth - 32
  //   }
  //   if (topTocInner.value) {
  //     topTocInner.value.style.transform = `translateX(${marginLeft.value}px)`
  //   }
  // }
}

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id')
      if (entry.isIntersecting) {
        console.log('id', id)
        const oldTocIndex = toc._value.links.findIndex(({id}) => id === currentToc.value)
        currentToc.value = id
        const currentTocIndex = toc._value.links.findIndex(({id}) => id === currentToc.value)
        if (oldTocIndex !== -1) {
          changeCurrentToc(id, oldTocIndex, currentTocIndex)
        }
        console.log('isIntersecting, currentToc', currentToc.value)
      }
    })
  }, observerOptions)

  document
    .querySelectorAll('._main-content h2[id]')
    .forEach((section) => {
      observer.value.observe(section)
    })
})

// watchDebounced(currentToc, (newActiveTocId, old) => {
//   const cn = toc._value.links.findIndex(({id}) => id === currentToc.value)
//   const nn = toc._value.links.findIndex(({id}) => id === old)
//   currentToc.value = newActiveTocId
//   console.log(cn, nn)

//   if (cn > nn) {
//     if (cn - nn > 1 && linkWidth[nn + 1].offsetWidth) {
//       marginLeft.value -= linkWidth[nn + 1].offsetWidth - 16
//     }
//     if (linkWidth[nn].offsetWidth) marginLeft.value -= linkWidth[nn].offsetWidth - 16
//   } else if (cn < nn) {
//     if (nn - cn > 1 && linkWidth[nn - 1].offsetWidth) {
//       marginLeft.value -= linkWidth[nn - 1].offsetWidth - 16
//     }
//     if (linkWidth[nn].offsetWidth) marginLeft.value += linkWidth[nn].offsetWidth - 16
//   }
//   if (topTocInner.value) {
//     topTocInner.value.style.transform = `translateX(${marginLeft.value}px)`
//   }
// }, { debounce: 100, maxWait: 5000 })

onUnmounted(() => {
  observer.value.disconnect()
})

</script>

<style scoped>
ul._toc {
  list-style: none;
  padding-left: 0;
}

._toc-container {
  width: 200px;
}
._fixed-toc {
  position: fixed;
  top: 0;
  left: 10rem;
  width: 50vw;
  height: 36px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  padding: .5rem 0 0;
  z-index: 40;
}

._fixed-toc ul {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

._flexd-toc ul::-webkit-scrollbar{
  display: none;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.5s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-10px);
}
</style>

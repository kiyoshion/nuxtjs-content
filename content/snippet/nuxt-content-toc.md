---
title: 'Nuxt Content2で目次生成'
shortTitle: 目次をつくる
tags: ['Nuxt3', 'Nuxt Content2']
category: 'nuxt-content'
---

components/Toc.vue
```
<template>
  <div>
    <ul v-if="toc && toc.links">
      <li v-for="(link, i) in toc.links" :key="link.text">
        <a :href="`#${link.id}`">
          <span>{{ i + 1 }}</span><span>{{ link.text }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { toc } = useContent()
</script>
```

表示したいpageのファイルで呼び出す。
pages/guide/[...slug].vue

```
<template>
  <div>
    <Toc />
    ...
  </div>
</template>

<script setup>
</script>
```

---
title: '動的なディレクトリ'
shortTitle: '動的なディレクトリ'
tag: 'Nuxt Content'
category: ''
---

for example, like below

```
/content
  /cheatsheet
    /git
    /nuxt
```

then

```
/pages
  /cheatsheet
    [...slug].vue
    index.vue
```

write [...slug].vue like this

```
<template>
  ...
</template>

<script setup>
const { path } = useRoute()
const target = path.replace('/cheatsheet/', '')
const cheatsheets = await queryContent('cheatsheet', target).find();
</script>
```

---
title: 'Nuxt3でPWAする'
tags: ['Nuxt.js 3', 'pwa']
type: 'ブログ'
icon: 'Nuxt.js'
category: 'nuxt-content'
---

## Nuxt.js 3.xでPWAをするには？

PWAのパッケージである`@nuxtjs/pwa`はNutx.js 3.xに対応していない様子。

Install `@nuxtjs/pwa`

```
npm install --dev @nuxtjs/pwa
```

Add `@nuxtjs/pwa` at modules

```
modules: [
  '@nuxtjs/pwa',
],
```

>NOTE: If using ssr: false with production mode without nuxt generate, you have to use modules instead of buildModules


[Infroduction - Nuxt PWA](https://pwa.nuxtjs.org/){:target="_blank"}

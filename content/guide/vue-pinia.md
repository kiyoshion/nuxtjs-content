---
title: 'Vue 3でVuexの代わりにpinia(ピーニャ)を使う'
tags: ['Vue 3', 'pinia']
type: 'ブログ'
icon: 'Nuxt.js'
category: 'nuxt-content'
---

Nuxt 3でVuex使おうとしたら公式で`pinia`というライブラリをおすすめされました。今回はVue 3とNuxt 3でピーニャしてみます。

>Nuxt no longer provides a Vuex integration. Instead, the official Vue recommendation is to use pinia, which has built-in Nuxt support via a Nuxt module. Find out more about pinia here.

[Migrate to Nuxt 3:configuration](https://nuxt.com/docs/migration/configuration#vuex){:target="_blank"}

>Pinia (pronounced /piːnjʌ/, like "peenya" in English)

[Introduction | Pinia](https://pinia.vuejs.org/introduction.html){:target="_blank"}

## piniaのインストール

Vue < 2.7は`@vue/composition-api`が必要みたいです。

>If your app is using Vue <2.7, you also need to install the composition api: @vue/composition-api. If you are using Nuxt, you should follow these instructions.

::tab{name1="Vue" name2="Nuxt" slug="nuxt"}
```
npm install pinia
```

#nuxt
```
npm install pinia @pinia/nuxt
```

nuxt.config.tsのmodulesに`@pinia/nuxt`を追加します。

```
export default defineNuxtConfig({
  modules: ['@pinia/nuxt']
})
```

プロジェクト直下に`store`ディレクトリを追加して`index.ts`ファイルをつくります。

```
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      // `this` is the store instance
      this.counter++
    },
  },
})
```

プロジェクト直下に`plugins`ディレクトリを追加して`pinia.ts`をつくります。

```
import { useMainStore } from '~/store'

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      store: useMainStore($pinia)
    }
  }
})
```

::

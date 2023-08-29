import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 0,
    subNav: false,
    currentGuideTag: 'All'
  }),
  actions: {
    increment() {
      this.counter++
    },
    toggleSubNav() {
      this.subNav = !this.subNav
    },
  },
})

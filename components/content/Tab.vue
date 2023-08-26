<template>
  <div>
    <div class="flex">
      <span @click="select(1)" class="text-sm hover:cursor-pointer py-1 px-4 border-b-2 mr-4" :class="{'border-green-300' : show === 1 }">{{ name1 }}</span>
      <span @click="select(2)" class="text-sm hover:cursor-pointer py-1 px-4 border-b-2" :class="{'border-green-300' : show === 2 }">{{ name2 }}</span>
    </div>
    <div>
      <slot v-if="show === 1" />
      <slot v-else-if="show === 2" :name="slug" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({ name1: '', name2: '', slug: '' })
let show = ref(1);
const select = (n) => show.value = n;
</script>

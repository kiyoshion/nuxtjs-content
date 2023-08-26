<template>
  <div>
    <div v-for="env in envs" :key="env.label">
      {{ env.label }}{{ env.value }}
    </div>
  </div>
</template>

<script setup>
defineProps({ envs: [{label: '', value: ''}] })
</script>

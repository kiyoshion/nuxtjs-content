<template>
  <div class="_layout">
    <AppHeader />
    <main class="_main-container">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
</script>

<style>
._main-container {
  width: calc(100% - 10rem);
  margin-left: 10rem;
}
._layout {
  position: relative;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>

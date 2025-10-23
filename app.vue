<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { initAuth } = useAuth()

// アプリ起動時に認証状態を初期化
onMounted(async () => {
  await initAuth()
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
</style>
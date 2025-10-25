<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { initAuth, user } = useAuth()
const router = useRouter()

onMounted(async () => {
  await initAuth()
  
  // ルートパスにアクセスした場合の処理
  if (window.location.pathname === '/') {
    if (user.value) {
      // 認証済み → ダッシュボードへ（そのまま）
    } else {
      // 未認証 → ウェルカムページへ
      router.push('/welcome')
    }
  }
})
</script>
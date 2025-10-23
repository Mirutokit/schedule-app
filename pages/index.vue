<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">
          予定管理・シフトアプリ
        </h1>
        <div v-if="user" class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            {{ userData?.displayName || 'ユーザー' }} さん
          </span>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto p-6">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">読み込み中...</p>
      </div>
      
      <div v-else-if="user" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">ダッシュボード</h2>
          <p class="text-gray-600">
            ようこそ、{{ userData?.displayName }}さん！
          </p>
          <p class="text-sm text-gray-500 mt-2">
            役割: {{ userData?.role }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">今日の予定</h2>
          <p class="text-gray-500">予定機能は次のPhaseで実装します</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, loading, logout, getUserData } = useAuth()
const router = useRouter()
const userData = ref<any>(null)

// ユーザーデータを取得
watchEffect(async () => {
  if (user.value) {
    userData.value = await getUserData(user.value.uid)
  }
})

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (e) {
    console.error('ログアウト失敗:', e)
  }
}
</script>
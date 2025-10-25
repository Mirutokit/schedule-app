<!-- pages/welcome.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- ヘッダー -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          予定管理・シフトアプリ
        </h1>
        <p class="text-xl text-gray-600">
          チームの予定を簡単に管理・共有
        </p>
      </div>

      <!-- 機能紹介 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-blue-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">カレンダー表示</h3>
          <p class="text-gray-600">
            月間カレンダーでチーム全体の予定を一目で確認
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-green-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">リアルタイム共有</h3>
          <p class="text-gray-600">
            メンバーの予定変更を即座に反映
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-purple-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">稼働履歴</h3>
          <p class="text-gray-600">
            過去の勤務記録を簡単に確認・集計
          </p>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="text-center space-y-4">
        <div class="flex justify-center gap-4">
          <NuxtLink
            to="/login"
            class="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg transition-colors"
          >
            ログイン
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 shadow-lg border-2 border-blue-600 transition-colors"
          >
            新規登録
          </NuxtLink>
        </div>
        <p class="text-sm text-gray-500">
          無料で今すぐ始められます
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const router = useRouter()

// 既にログイン済みの場合はダッシュボードへ
onMounted(() => {
  if (user.value) {
    router.push('/')
  }
})
</script>
<!-- pages/login.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          予定管理・シフトアプリ
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          ログインしてください
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">メールアドレス</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="メールアドレス"
            />
          </div>
          <div>
            <label for="password" class="sr-only">パスワード</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="パスワード"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'ログイン中...' : 'ログイン' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/register" class="text-sm text-blue-600 hover:text-blue-500">
            アカウントをお持ちでない方はこちら
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, error } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (e) {
    console.error('ログイン失敗:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
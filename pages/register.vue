<!-- pages/register.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          新規登録
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          アカウントを作成してください
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-3">
          <div>
            <label for="displayName" class="sr-only">名前</label>
            <input
              id="displayName"
              v-model="displayName"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="名前"
            />
          </div>
          <div>
            <label for="role" class="sr-only">役割</label>
            <input
              id="role"
              v-model="role"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="役割（例: エンジニア、デザイナー）"
            />
          </div>
          <div>
            <label for="email" class="sr-only">メールアドレス</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              minlength="6"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="パスワード（6文字以上）"
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
            {{ isLoading ? '登録中...' : '登録' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/login" class="text-sm text-blue-600 hover:text-blue-500">
            既にアカウントをお持ちの方はこちら
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register, error } = useAuth()
const router = useRouter()

const displayName = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  try {
    await register(email.value, password.value, displayName.value, role.value)
    router.push('/')
  } catch (e) {
    console.error('登録失敗:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
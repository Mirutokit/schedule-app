<!-- pages/profile.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow sticky top-0 z-30">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
           <MobileMenu />
          <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 hidden sm:block">
              ← 戻る
            </NuxtLink>
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">
            プロフィール設定
          </h1>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto p-4 md:p-6 max-w-2xl">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">読み込み中...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- プロフィール情報 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">基本情報</h2>
          
          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <!-- 名前 -->
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
                名前 <span class="text-red-500">*</span>
              </label>
              <input
                id="displayName"
                v-model="form.displayName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 役割 -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                役割 <span class="text-red-500">*</span>
              </label>
              <input
                id="role"
                v-model="form.role"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: エンジニア、デザイナー"
              />
            </div>

            <!-- メールアドレス（変更不可） -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                :value="userData?.email"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p class="text-xs text-gray-500 mt-1">※ メールアドレスは変更できません</p>
            </div>

            <!-- エラーメッセージ -->
            <div v-if="profileError" class="text-red-600 text-sm">
              {{ profileError }}
            </div>

            <!-- 成功メッセージ -->
            <div v-if="profileSuccess" class="text-green-600 text-sm">
              プロフィールを更新しました
            </div>

            <!-- ボタン -->
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="profileUpdating"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ profileUpdating ? '更新中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>

        <!-- パスワード変更 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">パスワード変更</h2>
          
          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <!-- 新しいパスワード -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                新しいパスワード <span class="text-red-500">*</span>
              </label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6文字以上"
              />
            </div>

            <!-- パスワード確認 -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                パスワード確認 <span class="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="もう一度入力してください"
              />
            </div>

            <!-- エラーメッセージ -->
            <div v-if="passwordError" class="text-red-600 text-sm">
              {{ passwordError }}
            </div>

            <!-- 成功メッセージ -->
            <div v-if="passwordSuccess" class="text-green-600 text-sm">
              パスワードを変更しました
            </div>

            <!-- ボタン -->
            <div>
              <button
                type="submit"
                :disabled="passwordUpdating"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ passwordUpdating ? '変更中...' : 'パスワードを変更' }}
              </button>
            </div>

            <p class="text-xs text-gray-500">
              ※ セキュリティのため、長期間ログインしていない場合は再ログインが必要になることがあります
            </p>
          </form>
        </div>

        <!-- アカウント情報 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">アカウント情報</h2>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b">
              <span class="text-gray-600">ユーザーID</span>
              <span class="font-mono text-gray-900">{{ user?.uid }}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="text-gray-600">登録日</span>
              <span class="text-gray-900">{{ formatDate(userData?.createdAt) }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">最終更新</span>
              <span class="text-gray-900">{{ formatDate(userData?.updatedAt) || '未更新' }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const { user, getUserData, updateProfile, changePassword } = useAuth()

const userData = ref<any>(null)
const loading = ref(false)

// プロフィールフォーム
const form = reactive({
  displayName: '',
  role: ''
})

const profileUpdating = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref(false)

// パスワードフォーム
const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

const passwordUpdating = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref(false)

// ユーザーデータを読み込み
const loadUserData = async () => {
  if (!user.value) return
  
  loading.value = true
  try {
    userData.value = await getUserData(user.value.uid)
    
    if (userData.value) {
      form.displayName = userData.value.displayName
      form.role = userData.value.role
    }
  } catch (error) {
    console.error('ユーザーデータ読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

// プロフィール更新
const handleUpdateProfile = async () => {
  if (!user.value) return
  
  profileUpdating.value = true
  profileError.value = null
  profileSuccess.value = false
  
  try {
    await updateProfile(user.value.uid, {
      displayName: form.displayName,
      role: form.role
    })
    
    profileSuccess.value = true
    
    // 成功メッセージを3秒後に消す
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
    
    // データを再読み込み
    await loadUserData()
  } catch (error) {
    console.error('プロフィール更新エラー:', error)
    profileError.value = 'プロフィールの更新に失敗しました'
  } finally {
    profileUpdating.value = false
  }
}

// パスワード変更
const handleChangePassword = async () => {
  passwordError.value = null
  passwordSuccess.value = false
  
  // バリデーション
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'パスワードが一致しません'
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'パスワードは6文字以上にしてください'
    return
  }
  
  passwordUpdating.value = true
  
  try {
    await changePassword(passwordForm.newPassword)
    
    passwordSuccess.value = true
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // 成功メッセージを3秒後に消す
    setTimeout(() => {
      passwordSuccess.value = false
    }, 3000)
  } catch (error: any) {
    console.error('パスワード変更エラー:', error)
    if (error.message.includes('再度ログイン')) {
      passwordError.value = 'セキュリティのため、一度ログアウトして再度ログインしてください'
    } else {
      passwordError.value = 'パスワードの変更に失敗しました'
    }
  } finally {
    passwordUpdating.value = false
  }
}

// 日付フォーマット
const formatDate = (date: any) => {
  if (!date) return ''
  if (date.toDate) {
    return dayjs(date.toDate()).format('YYYY/MM/DD HH:mm')
  }
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

onMounted(() => {
  loadUserData()
})
</script>
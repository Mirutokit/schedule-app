<!-- pages/members.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow sticky top-0 z-30">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 md:gap-4">
            <MobileMenu />

            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 hidden sm:block">
              ← 戻る
            </NuxtLink>
            <h1 class="text-xl md:text-2xl font-bold text-gray-800">
              メンバー一覧
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto p-4 md:p-6">
      <!-- 統計情報 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">総メンバー数</div>
          <div class="text-2xl md:text-3xl font-bold text-blue-600">{{ members.length }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">今日稼働中</div>
          <div class="text-2xl md:text-3xl font-bold text-green-600">{{ todayActiveCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">今週稼働予定</div>
          <div class="text-2xl md:text-3xl font-bold text-purple-600">{{ weekActiveCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">役割の種類</div>
          <div class="text-2xl md:text-3xl font-bold text-orange-600">{{ uniqueRoles }}</div>
        </div>
      </div>

      <!-- メンバー一覧 -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 md:p-6 border-b">
          <h2 class="text-base md:text-lg font-semibold">メンバー</h2>
        </div>

        <div v-if="loading" class="p-8 md:p-12 text-center text-gray-500">
          読み込み中...
        </div>

        <div v-else-if="members.length === 0" class="p-8 md:p-12 text-center text-gray-500">
          メンバーがいません
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
          <NuxtLink
            v-for="member in members"
            :key="member.id"
            :to="`/members/${member.id}`"
            class="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div class="flex items-start gap-4">
              <!-- アバター -->
              <div class="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
                {{ getInitials(member.displayName) }}
              </div>

              <!-- 情報 -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-base md:text-lg truncate">
                  {{ member.displayName }}
                </h3>
                <p class="text-xs md:text-sm text-gray-600 mb-2">
                  {{ member.role }}
                </p>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>登録: {{ formatDate(member.createdAt) }}</span>
                </div>
              </div>

              <!-- 矢印アイコン -->
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSchedule } from '~/composables/useSchedule'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const { getAllUsers, getTodaySchedules } = useSchedule()

const members = ref<any[]>([])
const todaySchedules = ref<any[]>([])
const loading = ref(false)

// 統計情報
const todayActiveCount = computed(() => {
  const uniqueUsers = new Set(todaySchedules.value.map(s => s.userId))
  return uniqueUsers.size
})

const weekActiveCount = computed(() => {
  // 簡易的に、登録されている全メンバーを表示
  // 実際には今週の予定を取得して計算
  return members.value.length
})

const uniqueRoles = computed(() => {
  const roles = new Set(members.value.map(m => m.role))
  return roles.size
})

// イニシャルを取得
const getInitials = (name: string) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// 日付フォーマット
const formatDate = (date: any) => {
  if (!date) return ''
  if (date.toDate) {
    return dayjs(date.toDate()).format('YYYY/MM/DD')
  }
  return dayjs(date).format('YYYY/MM/DD')
}

// メンバーを読み込み
const loadMembers = async () => {
  loading.value = true
  try {
    const users = await getAllUsers()
    members.value = users.sort((a, b) => 
      a.displayName.localeCompare(b.displayName, 'ja')
    )
    
    // 今日の予定も取得
    todaySchedules.value = await getTodaySchedules()
  } catch (error) {
    console.error('メンバー読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMembers()
})
</script>
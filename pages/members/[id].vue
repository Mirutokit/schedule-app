<!-- pages/members/[id].vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow sticky top-0 z-30">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <NuxtLink to="/members" class="text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">
            メンバー詳細
          </h1>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto p-4 md:p-6">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">読み込み中...</p>
      </div>

      <div v-else-if="!memberData" class="text-center py-12">
        <p class="text-gray-600">メンバーが見つかりません</p>
      </div>

      <div v-else class="space-y-6">
        <!-- プロフィールカード -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <!-- アバター -->
            <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {{ getInitials(memberData.displayName) }}
            </div>

            <!-- 基本情報 -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                {{ memberData.displayName }}
              </h2>
              <div class="space-y-2 text-gray-600">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ memberData.role }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ memberData.email }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>登録日: {{ formatDate(memberData.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 統計情報 -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-sm text-gray-600 mb-1">今後の予定</div>
            <div class="text-2xl font-bold text-blue-600">{{ upcomingSchedules.length }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-sm text-gray-600 mb-1">過去の稼働</div>
            <div class="text-2xl font-bold text-green-600">{{ pastSchedules.length }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-sm text-gray-600 mb-1">完了率</div>
            <div class="text-2xl font-bold text-purple-600">{{ completionRate }}%</div>
          </div>
        </div>

        <!-- 今後の予定 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">今後の予定</h3>
          
          <div v-if="upcomingSchedules.length === 0" class="text-center py-8 text-gray-500">
            今後の予定はありません
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="schedule in upcomingSchedules"
              :key="schedule.id"
              class="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-900">{{ schedule.title }}</h4>
                <span
                  :class="getStatusColorClass(schedule.status)"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ getStatusText(schedule.status) }}
                </span>
              </div>
              <p v-if="schedule.description" class="text-sm text-gray-700 mb-2">
                {{ schedule.description }}
              </p>
              <div class="text-sm text-gray-500">
                {{ formatDateTime(schedule.startTime) }} - {{ formatDateTime(schedule.endTime) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 過去の稼働履歴 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">過去の稼働履歴（最新10件）</h3>
          
          <div v-if="pastSchedules.length === 0" class="text-center py-8 text-gray-500">
            過去の稼働履歴はありません
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="schedule in pastSchedules"
              :key="schedule.id"
              class="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-900">{{ schedule.title }}</h4>
                <span
                  :class="getStatusColorClass(schedule.status)"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ getStatusText(schedule.status) }}
                </span>
              </div>
              <p v-if="schedule.description" class="text-sm text-gray-700 mb-2">
                {{ schedule.description }}
              </p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>{{ formatDateTime(schedule.startTime) }} - {{ formatDateTime(schedule.endTime) }}</span>
                <span>{{ calculateDuration(schedule.startTime, schedule.endTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSchedule } from '~/composables/useSchedule'
import { useAuth } from '~/composables/useAuth'
import dayjs from 'dayjs'
import type { Schedule } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { getUserData } = useAuth()
const { getUserUpcomingSchedules, getUserPastSchedules } = useSchedule()

const memberId = route.params.id as string
const memberData = ref<any>(null)
const upcomingSchedules = ref<Schedule[]>([])
const pastSchedules = ref<Schedule[]>([])
const loading = ref(false)

// 完了率を計算
const completionRate = computed(() => {
  if (pastSchedules.value.length === 0) return 0
  const completed = pastSchedules.value.filter(s => s.status === 'completed').length
  return Math.round((completed / pastSchedules.value.length) * 100)
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

// ステータスの色クラス
const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

// ステータステキスト
const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return '完了'
    case 'cancelled':
      return 'キャンセル'
    default:
      return '予定'
  }
}

// 日付フォーマット
const formatDate = (date: any) => {
  if (!date) return ''
  if (date.toDate) {
    return dayjs(date.toDate()).format('YYYY/MM/DD')
  }
  return dayjs(date).format('YYYY/MM/DD')
}

const formatDateTime = (timestamp: any) => {
  return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
}

// 期間を計算
const calculateDuration = (start: any, end: any) => {
  const startTime = dayjs(start.toDate())
  const endTime = dayjs(end.toDate())
  const hours = endTime.diff(startTime, 'hour')
  const minutes = endTime.diff(startTime, 'minute') % 60
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`
  }
  return `${minutes}分`
}

// メンバー情報を読み込み
const loadMemberData = async () => {
  loading.value = true
  try {
    memberData.value = await getUserData(memberId)
    
    if (memberData.value) {
      // 今後の予定を取得
      upcomingSchedules.value = await getUserUpcomingSchedules(memberId)
      
      // 過去の稼働履歴を取得
      pastSchedules.value = await getUserPastSchedules(memberId, 10)
    }
  } catch (error) {
    console.error('メンバーデータ読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMemberData()
})
</script>
<!-- pages/history.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow sticky top-0 z-30">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 md:gap-4">
            <!-- モバイルメニュー -->
            <MobileMenu />
            
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 hidden sm:block">
              ← 戻る
            </NuxtLink>
            <h1 class="text-xl md:text-2xl font-bold text-gray-800">
              稼働履歴
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto p-4 md:p-6">
      <!-- フィルター -->
      <div class="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3 md:hidden">フィルター</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <!-- 期間選択 -->
          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              期間
            </label>
            <select
              v-model="selectedPeriod"
              @change="updatePeriod"
              class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">今週</option>
              <option value="month">今月</option>
              <option value="3months">過去3ヶ月</option>
            </select>
          </div>

          <!-- ユーザーフィルター -->
          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              メンバー
            </label>
            <select
              v-model="selectedUserId"
              @change="loadHistory"
              class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全員</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.displayName }}
              </option>
            </select>
          </div>

          <!-- ステータスフィルター -->
          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              v-model="selectedStatus"
              @change="loadHistory"
              class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">すべて</option>
              <option value="scheduled">予定</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 統計情報 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">総予定数</div>
          <div class="text-2xl md:text-3xl font-bold text-blue-600">{{ stats.total }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">完了</div>
          <div class="text-2xl md:text-3xl font-bold text-green-600">{{ stats.completed }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">予定</div>
          <div class="text-2xl md:text-3xl font-bold text-gray-600">{{ stats.scheduled }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 mb-1">キャンセル</div>
          <div class="text-2xl md:text-3xl font-bold text-red-600">{{ stats.cancelled }}</div>
        </div>
      </div>

      <!-- 履歴一覧 -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 md:p-6 border-b">
          <h2 class="text-base md:text-lg font-semibold">稼働履歴一覧</h2>
        </div>
        
        <div v-if="loading" class="p-8 md:p-12 text-center text-gray-500">
          読み込み中...
        </div>
        
        <div v-else-if="historySchedules.length === 0" class="p-8 md:p-12 text-center text-gray-500">
          履歴がありません
        </div>
        
        <div v-else class="divide-y">
          <div
            v-for="schedule in historySchedules"
            :key="schedule.id"
            class="p-3 md:p-4 hover:bg-gray-50"
          >
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900 text-sm md:text-base break-words">
                      {{ schedule.title }}
                    </h3>
                    <span
                      :class="getStatusColorClass(schedule.status)"
                      class="px-2 py-1 text-xs rounded-full whitespace-nowrap"
                    >
                      {{ getStatusText(schedule.status) }}
                    </span>
                  </div>
                  <p class="text-xs md:text-sm text-gray-600 mb-1">{{ schedule.userName }}</p>
                  <p v-if="schedule.description" class="text-xs md:text-sm text-gray-700 mb-2 line-clamp-2">
                    {{ schedule.description }}
                  </p>
                </div>
                
                <!-- ステータス変更ボタン（自分の予定のみ） -->
                <div v-if="user?.uid === schedule.userId && schedule.status === 'scheduled'" 
                     class="flex gap-2 w-full sm:w-auto">
                  <button
                    @click="markAsCompleted(schedule.id)"
                    class="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 whitespace-nowrap"
                  >
                    完了
                  </button>
                  <button
                    @click="markAsCancelled(schedule.id)"
                    class="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 whitespace-nowrap"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-gray-500">
                <span class="break-all">{{ formatDateTime(schedule.startTime) }} - {{ formatDateTime(schedule.endTime) }}</span>
                <span class="whitespace-nowrap">{{ calculateDuration(schedule.startTime, schedule.endTime) }}</span>
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

const { getSchedules, getAllUsers, updateScheduleStatus } = useSchedule()
const { user } = useAuth()

const selectedPeriod = ref('month')
const selectedUserId = ref('')
const selectedStatus = ref('')
const users = ref<any[]>([])
const historySchedules = ref<Schedule[]>([])
const loading = ref(false)
const startDate = ref(new Date())
const endDate = ref(new Date())

const stats = computed(() => {
  const total = historySchedules.value.length
  const completed = historySchedules.value.filter(s => s.status === 'completed').length
  const scheduled = historySchedules.value.filter(s => s.status === 'scheduled').length
  const cancelled = historySchedules.value.filter(s => s.status === 'cancelled').length
  
  return { total, completed, scheduled, cancelled }
})

const updatePeriod = () => {
  const now = dayjs()
  
  switch (selectedPeriod.value) {
    case 'week':
      startDate.value = now.startOf('week').toDate()
      endDate.value = now.endOf('week').toDate()
      break
    case 'month':
      startDate.value = now.startOf('month').toDate()
      endDate.value = now.endOf('month').toDate()
      break
    case '3months':
      startDate.value = now.subtract(3, 'month').startOf('month').toDate()
      endDate.value = now.endOf('month').toDate()
      break
  }
  
  loadHistory()
}

const loadHistory = async () => {
  loading.value = true
  try {
    let schedules = await getSchedules(
      startDate.value,
      endDate.value,
      selectedUserId.value || undefined
    )
    
    if (selectedStatus.value) {
      schedules = schedules.filter(s => s.status === selectedStatus.value)
    }
    
    historySchedules.value = schedules.sort((a, b) => 
      b.startTime.toDate().getTime() - a.startTime.toDate().getTime()
    )
  } catch (error) {
    console.error('履歴読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    users.value = await getAllUsers()
  } catch (error) {
    console.error('ユーザー読み込みエラー:', error)
  }
}

const markAsCompleted = async (scheduleId: string) => {
  try {
    await updateScheduleStatus(scheduleId, 'completed')
    await loadHistory()
  } catch (error) {
    console.error('ステータス更新エラー:', error)
    alert('ステータスの更新に失敗しました')
  }
}

const markAsCancelled = async (scheduleId: string) => {
  if (!confirm('この予定をキャンセルしてもよろしいですか？')) {
    return
  }
  
  try {
    await updateScheduleStatus(scheduleId, 'cancelled')
    await loadHistory()
  } catch (error) {
    console.error('ステータス更新エラー:', error)
    alert('ステータスの更新に失敗しました')
  }
}

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

const formatDateTime = (timestamp: any) => {
  return dayjs(timestamp.toDate()).format('MM/DD HH:mm')
}

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

onMounted(async () => {
  await loadUsers()
  updatePeriod()
})
</script>
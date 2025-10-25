<!-- pages/history.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">
              ← 戻る
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-800">
              稼働履歴
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto p-6">
      <!-- フィルター -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 期間選択 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              期間
            </label>
            <select
              v-model="selectedPeriod"
              @change="updatePeriod"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">今週</option>
              <option value="month">今月</option>
              <option value="3months">過去3ヶ月</option>
            </select>
          </div>

          <!-- ユーザーフィルター -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              メンバー
            </label>
            <select
              v-model="selectedUserId"
              @change="loadHistory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全員</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.displayName }}
              </option>
            </select>
          </div>

          <!-- ステータスフィルター -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              v-model="selectedStatus"
              @change="loadHistory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-600 mb-1">総予定数</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.total }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-600 mb-1">完了</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.completed }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-600 mb-1">予定</div>
          <div class="text-3xl font-bold text-gray-600">{{ stats.scheduled }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-600 mb-1">キャンセル</div>
          <div class="text-3xl font-bold text-red-600">{{ stats.cancelled }}</div>
        </div>
      </div>

      <!-- 履歴一覧 -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold">稼働履歴一覧</h2>
        </div>
        
        <div v-if="loading" class="p-12 text-center text-gray-500">
          読み込み中...
        </div>
        
        <div v-else-if="historySchedules.length === 0" class="p-12 text-center text-gray-500">
          履歴がありません
        </div>
        
        <div v-else class="divide-y">
          <div
            v-for="schedule in historySchedules"
            :key="schedule.id"
            class="p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-gray-900">{{ schedule.title }}</h3>
                  <span
                    :class="getStatusColorClass(schedule.status)"
                    class="px-2 py-1 text-xs rounded-full"
                  >
                    {{ getStatusText(schedule.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-1">{{ schedule.userName }}</p>
                <p v-if="schedule.description" class="text-sm text-gray-700 mb-2">
                  {{ schedule.description }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ formatDateTime(schedule.startTime) }} - {{ formatDateTime(schedule.endTime) }}</span>
                  <span>{{ calculateDuration(schedule.startTime, schedule.endTime) }}</span>
                </div>
              </div>
              
              <!-- ステータス変更ボタン（自分の予定のみ） -->
              <div v-if="user?.uid === schedule.userId && schedule.status === 'scheduled'" class="flex gap-2">
                <button
                  @click="markAsCompleted(schedule.id)"
                  class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  完了
                </button>
                <button
                  @click="markAsCancelled(schedule.id)"
                  class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  キャンセル
                </button>
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

// 統計情報
const stats = computed(() => {
  const total = historySchedules.value.length
  const completed = historySchedules.value.filter(s => s.status === 'completed').length
  const scheduled = historySchedules.value.filter(s => s.status === 'scheduled').length
  const cancelled = historySchedules.value.filter(s => s.status === 'cancelled').length
  
  return { total, completed, scheduled, cancelled }
})

// 期間を更新
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

// 履歴を読み込み
const loadHistory = async () => {
  loading.value = true
  try {
    let schedules = await getSchedules(
      startDate.value,
      endDate.value,
      selectedUserId.value || undefined
    )
    
    // ステータスでフィルター
    if (selectedStatus.value) {
      schedules = schedules.filter(s => s.status === selectedStatus.value)
    }
    
    // 開始日時の降順でソート
    historySchedules.value = schedules.sort((a, b) => 
      b.startTime.toDate().getTime() - a.startTime.toDate().getTime()
    )
  } catch (error) {
    console.error('履歴読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

// ユーザー一覧を読み込み
const loadUsers = async () => {
  try {
    users.value = await getAllUsers()
  } catch (error) {
    console.error('ユーザー読み込みエラー:', error)
  }
}

// ステータスを完了にする
const markAsCompleted = async (scheduleId: string) => {
  try {
    await updateScheduleStatus(scheduleId, 'completed')
    await loadHistory()
  } catch (error) {
    console.error('ステータス更新エラー:', error)
    alert('ステータスの更新に失敗しました')
  }
}

// ステータスをキャンセルにする
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

// 日時フォーマット
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

// 初期化
onMounted(async () => {
  await loadUsers()
  updatePeriod()
})
</script>
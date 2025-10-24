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
        <!-- アクションボタン -->
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">ダッシュボード</h2>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            予定を追加
          </button>
        </div>

        <!-- 今日の稼働メンバー -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            今日の稼働メンバー
            <span class="text-sm font-normal text-gray-500">({{ todaySchedules.length }}人)</span>
          </h2>
          
          <div v-if="todaySchedules.length === 0" class="text-center py-8 text-gray-500">
            本日の予定はありません
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ScheduleCard
              v-for="schedule in todaySchedules"
              :key="schedule.id"
              :schedule="schedule"
              @edit="openEditModal"
              @delete="handleDelete"
            />
          </div>
        </div>

        <!-- 今週の予定 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            今週の予定
            <span class="text-sm font-normal text-gray-500">({{ weekSchedules.length }}件)</span>
          </h2>
          
          <div v-if="weekSchedules.length === 0" class="text-center py-8 text-gray-500">
            今週の予定はありません
          </div>
          
          <div v-else class="space-y-3">
            <ScheduleCard
              v-for="schedule in weekSchedules"
              :key="schedule.id"
              :schedule="schedule"
              @edit="openEditModal"
              @delete="handleDelete"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 予定登録・編集モーダル -->
    <ScheduleModal
      :is-open="isModalOpen"
      :editing-schedule="editingSchedule"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { Schedule } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { user, loading, logout, getUserData } = useAuth()
const { subscribeToSchedules, deleteSchedule } = useSchedule()
const router = useRouter()

const userData = ref<any>(null)
const todaySchedules = ref<Schedule[]>([])
const weekSchedules = ref<Schedule[]>([])
const isModalOpen = ref(false)
const editingSchedule = ref<Schedule | null>(null)

let unsubscribeToday: (() => void) | null = null
let unsubscribeWeek: (() => void) | null = null

// ユーザーデータを取得
watchEffect(async () => {
  if (user.value) {
    userData.value = await getUserData(user.value.uid)
  }
})

// 今日と今週の予定を監視
onMounted(() => {
  // 今日の予定
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  unsubscribeToday = subscribeToSchedules(today, tomorrow, (schedules) => {
    todaySchedules.value = schedules
  })

  // 今週の予定（月曜日から日曜日）
  const startOfWeek = dayjs().startOf('week').toDate()
  const endOfWeek = dayjs().endOf('week').toDate()
  
  unsubscribeWeek = subscribeToSchedules(startOfWeek, endOfWeek, (schedules) => {
    weekSchedules.value = schedules
  })
})

onUnmounted(() => {
  if (unsubscribeToday) unsubscribeToday()
  if (unsubscribeWeek) unsubscribeWeek()
})

const openAddModal = () => {
  editingSchedule.value = null
  isModalOpen.value = true
}

const openEditModal = (schedule: Schedule) => {
  editingSchedule.value = schedule
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingSchedule.value = null
}

const handleSubmit = () => {
  // モーダルが閉じられた後、自動的にリアルタイム更新される
}

const handleDelete = async (scheduleId: string) => {
  if (!confirm('この予定を削除してもよろしいですか？')) {
    return
  }

  try {
    await deleteSchedule(scheduleId)
  } catch (e) {
    console.error('削除エラー:', e)
    alert('予定の削除に失敗しました')
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (e) {
    console.error('ログアウト失敗:', e)
  }
}
</script>
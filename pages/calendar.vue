<!-- pages/calendar.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">
              ← 戻る
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-800">
              カレンダー
            </h1>
          </div>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            予定を追加
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- カレンダー -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <!-- 月選択 -->
            <div class="flex justify-between items-center mb-6">
              <button
                @click="previousMonth"
                class="px-4 py-2 hover:bg-gray-100 rounded"
              >
                ← 前月
              </button>
              <h2 class="text-xl font-semibold">
                {{ currentYear }}年 {{ currentMonth }}月
              </h2>
              <button
                @click="nextMonth"
                class="px-4 py-2 hover:bg-gray-100 rounded"
              >
                次月 →
              </button>
            </div>

            <!-- カレンダーグリッド -->
            <div class="grid grid-cols-7 gap-2">
              <!-- 曜日ヘッダー -->
              <div 
                v-for="day in ['日', '月', '火', '水', '木', '金', '土']" 
                :key="day"
                class="text-center text-sm font-semibold text-gray-600 py-2"
                :class="{
                  'text-red-600': day === '日',
                  'text-blue-600': day === '土'
                }"
              >
                {{ day }}
              </div>
              
              <!-- 日付 -->
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                @click="selectDate(day.date)"
                class="min-h-20 p-2 border rounded cursor-pointer transition-all"
                :class="{
                  'bg-gray-50 text-gray-400': day.month !== currentMonth,
                  'bg-blue-50 border-blue-300': isToday(day.date),
                  'bg-blue-100 border-blue-400': isSelectedDate(day.date),
                  'hover:bg-gray-100': day.month === currentMonth,
                  'hover:border-blue-300': day.month === currentMonth
                }"
              >
                <div class="text-right text-sm font-semibold mb-1">
                  {{ day.day }}
                </div>
                <div v-if="day.scheduleCount > 0" class="text-xs">
                  <span class="bg-blue-600 text-white px-2 py-1 rounded-full">
                    {{ day.scheduleCount }}件
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 選択日の予定一覧 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 class="text-lg font-semibold mb-4">
              {{ formatSelectedDate(selectedDate) }}の予定
            </h3>
            
            <div v-if="selectedDateSchedules.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>予定がありません</p>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="schedule in selectedDateSchedules"
                :key="schedule.id"
                class="border rounded-lg p-3 hover:bg-gray-50"
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
                <p class="text-sm text-gray-600 mb-1">{{ schedule.userName }}</p>
                <p v-if="schedule.description" class="text-sm text-gray-700 mb-2">
                  {{ schedule.description }}
                </p>
                <div class="text-xs text-gray-500">
                  {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
                </div>
                
                <!-- 自分の予定の場合のみ編集・削除ボタン -->
                <div v-if="user?.uid === schedule.userId" class="flex gap-2 mt-2">
                  <button
                    @click="openEditModal(schedule)"
                    class="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    編集
                  </button>
                  <button
                    @click="handleDelete(schedule.id)"
                    class="flex-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ScheduleModal
      :is-open="isModalOpen"
      :editing-schedule="editingSchedule"
      @close="closeModal"
      @submit="handleSubmit"
    />
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

const { getSchedules, deleteSchedule } = useSchedule()
const { user } = useAuth()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const schedules = ref<Schedule[]>([])
const selectedDate = ref(new Date()) // 選択された日付
const selectedDateSchedules = ref<Schedule[]>([]) // 選択された日付の予定
const loading = ref(false)
const isModalOpen = ref(false)
const editingSchedule = ref<Schedule | null>(null)
const calendarDays = ref<any[]>([])

// 日付が選択されているかチェック
const isSelectedDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs(selectedDate.value).format('YYYY-MM-DD')
}

// 選択された日付をフォーマット
const formatSelectedDate = (date: Date) => {
  return dayjs(date).format('YYYY年M月D日(ddd)')
}

// 時刻をフォーマット
const formatTime = (timestamp: any) => {
  return dayjs(timestamp.toDate()).format('HH:mm')
}

// 日付を選択
const selectDate = (date: Date) => {
  selectedDate.value = date
  updateSelectedDateSchedules()
}

// 選択された日付の予定を更新
const updateSelectedDateSchedules = () => {
  selectedDateSchedules.value = schedules.value.filter(schedule => {
    const scheduleDate = dayjs(schedule.startTime.toDate()).format('YYYY-MM-DD')
    const selected = dayjs(selectedDate.value).format('YYYY-MM-DD')
    return scheduleDate === selected
  }).sort((a, b) => 
    a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
  )
}

// カレンダーの日付を生成
const generateCalendar = () => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days = []
  
  // 前月の日付
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value - 1, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: currentMonth.value - 1,
      date: new Date(currentYear.value, currentMonth.value - 2, prevMonthLastDay - i),
      scheduleCount: 0
    })
  }
  
  // 今月の日付
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear.value, currentMonth.value - 1, i)
    const count = schedules.value.filter(s => 
      dayjs(s.startTime.toDate()).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
    ).length
    
    days.push({
      day: i,
      month: currentMonth.value,
      date,
      scheduleCount: count
    })
  }
  
  // 次月の日付（7の倍数にする）
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentMonth.value + 1,
        date: new Date(currentYear.value, currentMonth.value, i),
        scheduleCount: 0
      })
    }
  }
  
  calendarDays.value = days
}

// 今日かチェック
const isToday = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
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

// 月の予定を読み込み
const loadSchedules = async () => {
  loading.value = true
  try {
    const startOfMonth = new Date(currentYear.value, currentMonth.value - 1, 1)
    const endOfMonth = new Date(currentYear.value, currentMonth.value, 0, 23, 59, 59)
    
    const data = await getSchedules(startOfMonth, endOfMonth)
    schedules.value = data.sort((a, b) => 
      a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
    )
    
    generateCalendar()
    updateSelectedDateSchedules()
  } catch (error) {
    console.error('予定読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

const previousMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  loadSchedules()
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  loadSchedules()
}

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
  loadSchedules()
}

const handleDelete = async (scheduleId: string) => {
  if (!confirm('この予定を削除してもよろしいですか？')) {
    return
  }

  try {
    await deleteSchedule(scheduleId)
    loadSchedules()
  } catch (e) {
    console.error('削除エラー:', e)
    alert('予定の削除に失敗しました')
  }
}

onMounted(() => {
  loadSchedules()
})
</script>
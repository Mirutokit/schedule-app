<!-- pages/calendar.vue (カレンダービュー付き軽量版) -->
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
      <!-- 月選択 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
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

        <!-- シンプルなカレンダーグリッド -->
        <div class="grid grid-cols-7 gap-2">
          <!-- 曜日ヘッダー -->
          <div v-for="day in ['日', '月', '火', '水', '木', '金', '土']" :key="day"
               class="text-center text-sm font-semibold text-gray-600 py-2">
            {{ day }}
          </div>
          
          <!-- 日付 -->
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="min-h-20 p-2 border rounded"
            :class="{
              'bg-gray-50 text-gray-400': day.month !== currentMonth,
              'bg-blue-50': isToday(day.date)
            }"
          >
            <div class="text-right text-sm font-semibold mb-1">
              {{ day.day }}
            </div>
            <div v-if="day.scheduleCount > 0" class="text-xs text-blue-600">
              {{ day.scheduleCount }}件
            </div>
          </div>
        </div>
      </div>

      <!-- 予定一覧 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">今月の予定一覧</h3>
        
        <div v-if="loading" class="text-center py-8 text-gray-500">
          読み込み中...
        </div>
        
        <div v-else-if="schedules.length === 0" class="text-center py-8 text-gray-500">
          予定がありません
        </div>
        
        <div v-else class="space-y-3">
          <ScheduleCard
            v-for="schedule in schedules"
            :key="schedule.id"
            :schedule="schedule"
            @edit="openEditModal"
            @delete="handleDelete"
          />
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
import dayjs from 'dayjs'
import type { Schedule } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { getSchedules, deleteSchedule } = useSchedule()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const schedules = ref<Schedule[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const editingSchedule = ref<Schedule | null>(null)
const calendarDays = ref<any[]>([])

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
<!-- pages/calendar.vue -->
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
              カレンダー
            </h1>
          </div>
          <button
            @click="openAddModal"
            class="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
          >
            <span class="hidden sm:inline">予定を追加</span>
            <span class="sm:hidden">+</span>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4 md:p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- カレンダー -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-4 md:p-6">
            <!-- 月選択 -->
            <div class="flex justify-between items-center mb-4 md:mb-6">
              <button
                @click="previousMonth"
                class="px-3 py-2 md:px-4 md:py-2 hover:bg-gray-100 rounded text-sm md:text-base"
              >
                <span class="hidden sm:inline">← 前月</span>
                <span class="sm:hidden">←</span>
              </button>
              <h2 class="text-lg md:text-xl font-semibold">
                {{ currentYear }}年 {{ currentMonth }}月
              </h2>
              <button
                @click="nextMonth"
                class="px-3 py-2 md:px-4 md:py-2 hover:bg-gray-100 rounded text-sm md:text-base"
              >
                <span class="hidden sm:inline">次月 →</span>
                <span class="sm:hidden">→</span>
              </button>
            </div>

            <!-- カレンダーグリッド -->
            <div class="grid grid-cols-7 gap-1 md:gap-2">
              <!-- 曜日ヘッダー -->
              <div 
                v-for="day in ['日', '月', '火', '水', '木', '金', '土']" 
                :key="day"
                class="text-center text-xs md:text-sm font-semibold text-gray-600 py-1 md:py-2"
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
                class="min-h-16 md:min-h-20 p-1 md:p-2 border rounded cursor-pointer transition-all"
                :class="{
                  'bg-gray-50 text-gray-400': day.month !== currentMonth,
                  'bg-blue-50 border-blue-300': isToday(day.date),
                  'bg-blue-100 border-blue-400 ring-2 ring-blue-300': isSelectedDate(day.date),
                  'hover:bg-gray-100': day.month === currentMonth,
                  'hover:border-blue-300': day.month === currentMonth
                }"
              >
                <div class="text-right text-xs md:text-sm font-semibold mb-1">
                  {{ day.day }}
                </div>
                <div v-if="day.scheduleCount > 0" class="text-xs">
                  <span class="bg-blue-600 text-white px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs">
                    {{ day.scheduleCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 選択日の予定一覧 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-4 md:p-6 lg:sticky lg:top-24">
            <h3 class="text-base md:text-lg font-semibold mb-4">
              {{ formatSelectedDate(selectedDate) }}の予定
            </h3>
            
            <div v-if="selectedDateSchedules.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm md:text-base">予定がありません</p>
            </div>
            
            <div v-else class="space-y-3 max-h-[60vh] overflow-y-auto">
              <div
                v-for="schedule in selectedDateSchedules"
                :key="schedule.id"
                class="border rounded-lg p-3 hover:bg-gray-50"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-start">
                    <h4 class="font-semibold text-gray-900 text-sm md:text-base flex-1 break-words">
                      {{ schedule.title }}
                    </h4>
                    <span
                      :class="getStatusColorClass(schedule.status)"
                      class="px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2"
                    >
                      {{ getStatusText(schedule.status) }}
                    </span>
                  </div>
                  <p class="text-xs md:text-sm text-gray-600">{{ schedule.userName }}</p>
                  <p v-if="schedule.description" class="text-xs md:text-sm text-gray-700 line-clamp-2">
                    {{ schedule.description }}
                  </p>
                  <div class="text-xs text-gray-500">
                    {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
                  </div>
                  
                  <!-- 自分の予定の場合のみ編集・削除ボタン -->
                  <div v-if="user?.uid === schedule.userId" class="flex gap-2 mt-2">
                    <button
                      @click="openEditModal(schedule)"
                      class="flex-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      編集
                    </button>
                    <button
                      @click="handleDelete(schedule.id)"
                      class="flex-1 px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      削除
                    </button>
                  </div>
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
const selectedDate = ref(new Date())
const selectedDateSchedules = ref<Schedule[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const editingSchedule = ref<Schedule | null>(null)
const calendarDays = ref<any[]>([])

const isSelectedDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs(selectedDate.value).format('YYYY-MM-DD')
}

const formatSelectedDate = (date: Date) => {
  return dayjs(date).format('M月D日(ddd)')
}

const formatTime = (timestamp: any) => {
  return dayjs(timestamp.toDate()).format('HH:mm')
}

const selectDate = (date: Date) => {
  selectedDate.value = date
  updateSelectedDateSchedules()
}

const updateSelectedDateSchedules = () => {
  selectedDateSchedules.value = schedules.value.filter(schedule => {
    const scheduleDate = dayjs(schedule.startTime.toDate()).format('YYYY-MM-DD')
    const selected = dayjs(selectedDate.value).format('YYYY-MM-DD')
    return scheduleDate === selected
  }).sort((a, b) => 
    a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
  )
}

const generateCalendar = () => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days = []
  
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value - 1, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: currentMonth.value - 1,
      date: new Date(currentYear.value, currentMonth.value - 2, prevMonthLastDay - i),
      scheduleCount: 0
    })
  }
  
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

const isToday = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
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
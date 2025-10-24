<!-- components/Calendar.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- カレンダーヘッダー -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">
        {{ currentYear }}年 {{ currentMonth }}月
      </h2>
      <div class="flex gap-2">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded"
          title="前の月"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="goToToday"
          class="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          今日
        </button>
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded"
          title="次の月"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 曜日ヘッダー -->
    <div class="grid grid-cols-7 gap-2 mb-2">
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
    </div>

    <!-- カレンダーグリッド -->
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        @click="selectDate(day)"
        class="min-h-24 p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
        :class="{
          'bg-blue-50 border-blue-300': isToday(day),
          'bg-gray-50 text-gray-400': !isCurrentMonth(day, currentMonth),
          'bg-white': isCurrentMonth(day, currentMonth) && !isToday(day)
        }"
      >
        <!-- 日付 -->
        <div class="text-right mb-1">
          <span
            class="text-sm font-semibold"
            :class="{
              'text-blue-600': isToday(day),
              'text-gray-400': !isCurrentMonth(day, currentMonth),
              'text-gray-900': isCurrentMonth(day, currentMonth) && !isToday(day)
            }"
          >
            {{ day.getDate() }}
          </span>
        </div>

        <!-- その日の予定 -->
        <div v-if="getDaySchedules(day).length > 0" class="space-y-1">
          <div
            v-for="schedule in getDaySchedules(day).slice(0, 2)"
            :key="schedule.id"
            class="text-xs p-1 rounded truncate"
            :class="getScheduleColorClass(schedule)"
          >
            {{ schedule.title }}
          </div>
          <div
            v-if="getDaySchedules(day).length > 2"
            class="text-xs text-gray-500"
          >
            他{{ getDaySchedules(day).length - 2 }}件
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { Schedule } from '~/types'

const props = defineProps<{
  schedules: Schedule[]
}>()

const emit = defineEmits<{
  selectDate: [date: Date]
}>()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const calendarDays = ref<Date[]>([])

// カレンダーを生成
const generateCalendar = (year: number, month: number) => {
  const firstDay = dayjs(new Date(year, month - 1, 1))
  const lastDay = firstDay.endOf('month')
  
  // 月の最初の週の日曜日から開始
  let startDay = firstDay.startOf('week')
  
  // 月の最後の週の土曜日まで
  let endDay = lastDay.endOf('week')
  
  const days: Date[] = []
  let current = startDay
  
  while (current.isBefore(endDay) || current.isSame(endDay, 'day')) {
    days.push(current.toDate())
    current = current.add(1, 'day')
  }
  
  return days
}

// カレンダーを更新
const updateCalendar = () => {
  calendarDays.value = generateCalendar(currentYear.value, currentMonth.value)
}

// 前の月へ
const previousMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  updateCalendar()
  emit('selectDate', new Date(currentYear.value, currentMonth.value - 1, 1))
}

// 次の月へ
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  updateCalendar()
  emit('selectDate', new Date(currentYear.value, currentMonth.value - 1, 1))
}

// 今日に戻る
const goToToday = () => {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth() + 1
  updateCalendar()
  emit('selectDate', today)
}

// 日付選択
const selectDate = (date: Date) => {
  emit('selectDate', date)
}

// 日付が同じかチェック
const isSameDay = (date1: Date, date2: Date) => {
  return dayjs(date1).format('YYYY-MM-DD') === dayjs(date2).format('YYYY-MM-DD')
}

// 今日かチェック
const isToday = (date: Date) => {
  return isSameDay(date, new Date())
}

// 月内の日付かチェック
const isCurrentMonth = (date: Date, month: number) => {
  return dayjs(date).month() + 1 === month
}

// その日の予定を取得
const getDaySchedules = (date: Date) => {
  return props.schedules.filter(schedule => {
    const scheduleDate = schedule.startTime.toDate()
    return isSameDay(date, scheduleDate)
  })
}

// 予定の色クラスを取得
const getScheduleColorClass = (schedule: Schedule) => {
  switch (schedule.status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

// 初期化
onMounted(() => {
  updateCalendar()
})
</script>
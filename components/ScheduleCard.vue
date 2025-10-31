<!-- components/ScheduleCard.vue -->
<template>
  <div class="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <h3 class="font-semibold text-gray-900 truncate">{{ schedule.title }}</h3>
          <span
            :class="statusClass"
            class="px-2 py-1 text-xs rounded-full whitespace-nowrap"
          >
            {{ statusText }}
          </span>
        </div>
        
        <p class="text-sm text-gray-600 mb-2">{{ schedule.userName }}</p>
        
        <p v-if="schedule.description" class="text-sm text-gray-700 mb-3 line-clamp-2">
          {{ schedule.description }}
        </p>
        
        <div class="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="break-all">{{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}</span>
          </div>
        </div>
      </div>

      <!-- アクションボタン -->
      <div v-if="isOwner" class="flex sm:flex-col gap-2 w-full sm:w-auto">
        <button
          @click="$emit('edit', schedule)"
          class="flex-1 sm:flex-none p-2 text-blue-600 hover:bg-blue-50 rounded text-sm"
          title="編集"
        >
          <span class="sm:hidden">編集</span>
          <svg class="hidden sm:block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', schedule.id)"
          class="flex-1 sm:flex-none p-2 text-red-600 hover:bg-red-50 rounded text-sm"
          title="削除"
        >
          <span class="sm:hidden">削除</span>
          <svg class="hidden sm:block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import dayjs from 'dayjs'
import type { Schedule } from '~/types'

const props = defineProps<{
  schedule: Schedule
}>()

defineEmits<{
  edit: [schedule: Schedule]
  delete: [scheduleId: string]
}>()

const { user } = useAuth()

const isOwner = computed(() => {
  return user.value?.uid === props.schedule.userId
})

const statusClass = computed(() => {
  switch (props.schedule.status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
})

const statusText = computed(() => {
  switch (props.schedule.status) {
    case 'completed':
      return '完了'
    case 'cancelled':
      return 'キャンセル'
    default:
      return '予定'
  }
})

const formatTime = (timestamp: any) => {
  return dayjs(timestamp.toDate()).format('MM/DD HH:mm')
}
</script>
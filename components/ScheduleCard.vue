<!-- components/ScheduleCard.vue -->
<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="font-semibold text-gray-900">{{ schedule.title }}</h3>
          <span
            :class="statusClass"
            class="px-2 py-1 text-xs rounded-full"
          >
            {{ statusText }}
          </span>
        </div>
        
        <p class="text-sm text-gray-600 mb-2">{{ schedule.userName }}</p>
        
        <p v-if="schedule.description" class="text-sm text-gray-700 mb-3">
          {{ schedule.description }}
        </p>
        
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
          </div>
        </div>
      </div>

      <!-- アクションボタン（自分の予定のみ） -->
      <div v-if="isOwner" class="flex gap-2">
        <button
          @click="$emit('edit', schedule)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded"
          title="編集"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', schedule.id)"
          class="p-2 text-red-600 hover:bg-red-50 rounded"
          title="削除"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
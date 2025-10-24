<!-- components/ScheduleModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- 背景オーバーレイ -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="close"></div>
    
    <!-- モーダル本体 -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <!-- ヘッダー -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingSchedule ? '予定を編集' : '予定を登録' }}
          </h3>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- フォーム -->
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- タイトル -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                予定名 <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: オフィス勤務"
              />
            </div>

            <!-- 説明 -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="詳細な説明を入力..."
              ></textarea>
            </div>

            <!-- 開始日時 -->
            <div>
              <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">
                開始日時 <span class="text-red-500">*</span>
              </label>
              <input
                id="startTime"
                v-model="form.startTime"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 終了日時 -->
            <div>
              <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">
                終了日時 <span class="text-red-500">*</span>
              </label>
              <input
                id="endTime"
                v-model="form.endTime"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- エラーメッセージ -->
            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>
          </div>

          <!-- ボタン -->
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="close"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { Schedule } from '~/types'

const props = defineProps<{
  isOpen: boolean
  editingSchedule?: Schedule | null
}>()

const emit = defineEmits<{
  close: []
  submit: []
}>()

const { createSchedule, updateSchedule } = useSchedule()

const form = reactive({
  title: '',
  description: '',
  startTime: '',
  endTime: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

// 編集時にフォームに値を設定
watch(() => props.editingSchedule, (schedule) => {
  if (schedule) {
    form.title = schedule.title
    form.description = schedule.description
    form.startTime = dayjs(schedule.startTime.toDate()).format('YYYY-MM-DDTHH:mm')
    form.endTime = dayjs(schedule.endTime.toDate()).format('YYYY-MM-DDTHH:mm')
  } else {
    // 新規登録時は現在時刻から1時間後までをデフォルト設定
    const now = dayjs()
    form.title = ''
    form.description = ''
    form.startTime = now.format('YYYY-MM-DDTHH:mm')
    form.endTime = now.add(1, 'hour').format('YYYY-MM-DDTHH:mm')
  }
}, { immediate: true })

const handleSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    const startTime = new Date(form.startTime)
    const endTime = new Date(form.endTime)

    // バリデーション
    if (endTime <= startTime) {
      error.value = '終了日時は開始日時より後にしてください'
      loading.value = false
      return
    }

    if (props.editingSchedule) {
      // 編集
      await updateSchedule(props.editingSchedule.id, {
        title: form.title,
        description: form.description,
        startTime,
        endTime
      })
    } else {
      // 新規登録
      await createSchedule({
        title: form.title,
        description: form.description,
        startTime,
        endTime
      })
    }

    emit('submit')
    close()
  } catch (e: any) {
    console.error('予定保存エラー:', e)
    error.value = '予定の保存に失敗しました'
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}
</script>
// composables/useCalendar.ts
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')

export const useCalendar = () => {
  // 月のカレンダーデータを生成
  const generateCalendar = (year: number, month: number) => {
    const firstDay = dayjs(new Date(year, month - 1, 1))
    const lastDay = firstDay.endOf('month')
    
    // 月の最初の週の日曜日から開始
    const startDay = firstDay.day(0) // 日曜日
    
    // 月の最後の週の土曜日まで
    const endDay = lastDay.day(6) // 土曜日
    
    const days: Date[] = []
    let current = startDay
    
    while (current.isBefore(endDay) || current.isSame(endDay, 'day')) {
      days.push(current.toDate())
      current = current.add(1, 'day')
    }
    
    return {
      days,
      firstDay: firstDay.toDate(),
      lastDay: lastDay.toDate(),
      year,
      month
    }
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

  // 日付フォーマット
  const formatDate = (date: Date, format: string = 'YYYY/MM/DD') => {
    return dayjs(date).format(format)
  }

  // 曜日の取得
  const getDayOfWeek = (date: Date) => {
    return dayjs(date).format('ddd')
  }

  return {
    generateCalendar,
    isSameDay,
    isToday,
    isCurrentMonth,
    formatDate,
    getDayOfWeek
  }
}
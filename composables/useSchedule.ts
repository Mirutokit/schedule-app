// composables/useSchedule.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
  type QueryConstraint
} from 'firebase/firestore'
import type { Schedule, ScheduleForm } from '~/types'

export const useSchedule = () => {
  const { $db } = useNuxtApp()
  const { user, getUserData } = useAuth()
  
  // 予定の作成
  const createSchedule = async (scheduleData: ScheduleForm) => {
    if (!user.value) {
      throw new Error('ユーザーが認証されていません')
    }
    
    try {
      const userData = await getUserData(user.value.uid)
      
      const newSchedule = {
        userId: user.value.uid,
        userName: userData?.displayName || '不明',
        title: scheduleData.title,
        description: scheduleData.description,
        startTime: Timestamp.fromDate(scheduleData.startTime),
        endTime: Timestamp.fromDate(scheduleData.endTime),
        status: 'scheduled',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection($db, 'schedules'), newSchedule)
      return docRef.id
    } catch (error) {
      console.error('予定作成エラー:', error)
      throw error
    }
  }

  // 予定の更新
  const updateSchedule = async (scheduleId: string, data: Partial<ScheduleForm>) => {
    try {
      const scheduleRef = doc($db, 'schedules', scheduleId)
      const updateData: any = {
        updatedAt: Timestamp.now()
      }
      
      if (data.title) updateData.title = data.title
      if (data.description) updateData.description = data.description
      if (data.startTime) updateData.startTime = Timestamp.fromDate(data.startTime)
      if (data.endTime) updateData.endTime = Timestamp.fromDate(data.endTime)
      
      await updateDoc(scheduleRef, updateData)
    } catch (error) {
      console.error('予定更新エラー:', error)
      throw error
    }
  }

  // 予定のステータス更新
  const updateScheduleStatus = async (scheduleId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const scheduleRef = doc($db, 'schedules', scheduleId)
      await updateDoc(scheduleRef, {
        status,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('ステータス更新エラー:', error)
      throw error
    }
  }

  // 予定の削除
  const deleteSchedule = async (scheduleId: string) => {
    try {
      await deleteDoc(doc($db, 'schedules', scheduleId))
    } catch (error) {
      console.error('予定削除エラー:', error)
      throw error
    }
  }

  // 期間指定で予定を取得
  const getSchedules = async (startDate: Date, endDate: Date, userId?: string) => {
    try {
      const constraints: QueryConstraint[] = [
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('startTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'asc')
      ]
      
      if (userId) {
        constraints.unshift(where('userId', '==', userId))
      }
      
      const q = query(collection($db, 'schedules'), ...constraints)
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Schedule[]
    } catch (error) {
      console.error('予定取得エラー:', error)
      throw error
    }
  }

  // 今日の予定を取得
  const getTodaySchedules = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return await getSchedules(today, tomorrow)
  }

  // リアルタイムリスナー
  const subscribeToSchedules = (
    startDate: Date,
    endDate: Date,
    callback: (schedules: Schedule[]) => void,
    userId?: string
  ) => {
    try {
      const constraints: QueryConstraint[] = [
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('startTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'asc')
      ]
      
      if (userId) {
        constraints.unshift(where('userId', '==', userId))
      }
      
      const q = query(collection($db, 'schedules'), ...constraints)
      
      return onSnapshot(q, (snapshot) => {
        const schedules = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Schedule[]
        callback(schedules)
      })
    } catch (error) {
      console.error('リアルタイム監視エラー:', error)
      throw error
    }
  }

  // 全ユーザーの一覧を取得
  const getAllUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection($db, 'users'))
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('ユーザー一覧取得エラー:', error)
      throw error
    }
  }

  return {
    createSchedule,
    updateSchedule,
    updateScheduleStatus,
    deleteSchedule,
    getSchedules,
    getTodaySchedules,
    subscribeToSchedules,
    getAllUsers
  }
}
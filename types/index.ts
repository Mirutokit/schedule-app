// types/index.ts
import { Timestamp } from 'firebase/firestore'

export interface User {
  id: string
  email: string
  displayName: string
  role: string
  photoURL?: string
  createdAt: Date
}

export interface Schedule {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  startTime: Timestamp
  endTime: Timestamp
  status: 'scheduled' | 'completed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ScheduleForm {
  title: string
  description: string
  startTime: Date
  endTime: Date
}
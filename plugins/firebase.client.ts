// plugins/firebase.client.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // デバッグログ（一時的）
  console.log('=== Firebase 設定確認 ===')
  console.log('API Key:', config.public.firebaseApiKey)
  console.log('Auth Domain:', config.public.firebaseAuthDomain)
  console.log('Project ID:', config.public.firebaseProjectId)
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string
  }

  console.log('Firebase Config:', firebaseConfig)

  // Firebaseアプリを初期化
  const app = initializeApp(firebaseConfig)
  
  // 認証とFirestoreのインスタンスを取得
  const auth = getAuth(app)
  const db = getFirestore(app)

  return {
    provide: {
      auth,
      db
    }
  }
})
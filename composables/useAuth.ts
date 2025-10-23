// composables/useAuth.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuth = () => {
  const { $auth, $db } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const loading = useState('authLoading', () => true)
  const error = useState<string | null>('authError', () => null)

  // 認証状態の初期化と監視
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged($auth, async (firebaseUser) => {
        user.value = firebaseUser
        loading.value = false
        resolve(firebaseUser)
      })
    })
  }

  // Firestoreからユーザー情報を取得
  const getUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc($db, 'users', userId))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (e) {
      console.error('ユーザーデータの取得エラー:', e)
      return null
    }
  }

  // ログイン
  const login = async (email: string, password: string) => {
    try {
      error.value = null
      const userCredential = await signInWithEmailAndPassword($auth, email, password)
      return userCredential.user
    } catch (e: any) {
      console.error('ログインエラー:', e)
      if (e.code === 'auth/user-not-found') {
        error.value = 'ユーザーが見つかりません'
      } else if (e.code === 'auth/wrong-password') {
        error.value = 'パスワードが正しくありません'
      } else if (e.code === 'auth/invalid-email') {
        error.value = 'メールアドレスの形式が正しくありません'
      } else {
        error.value = 'ログインに失敗しました'
      }
      throw e
    }
  }

  // 新規登録
  const register = async (email: string, password: string, displayName: string, role: string = 'メンバー') => {
    try {
      error.value = null
      // Firebase Authenticationにユーザーを作成
      const userCredential = await createUserWithEmailAndPassword($auth, email, password)
      const user = userCredential.user
      
      // Firestoreにユーザー情報を保存
      await setDoc(doc($db, 'users', user.uid), {
        email: user.email,
        displayName,
        role,
        createdAt: new Date()
      })
      
      return user
    } catch (e: any) {
      console.error('登録エラー:', e)
      if (e.code === 'auth/email-already-in-use') {
        error.value = 'このメールアドレスは既に使用されています'
      } else if (e.code === 'auth/weak-password') {
        error.value = 'パスワードは6文字以上にしてください'
      } else if (e.code === 'auth/invalid-email') {
        error.value = 'メールアドレスの形式が正しくありません'
      } else {
        error.value = '登録に失敗しました'
      }
      throw e
    }
  }

  // ログアウト
  const logout = async () => {
    try {
      error.value = null
      await signOut($auth)
      user.value = null
    } catch (e: any) {
      console.error('ログアウトエラー:', e)
      error.value = 'ログアウトに失敗しました'
      throw e
    }
  }

  return {
    user,
    loading,
    error,
    initAuth,
    getUserData,
    login,
    register,
    logout
  }
}
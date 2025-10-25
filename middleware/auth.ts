// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user, loading } = useAuth()

  // ローディング中は待機
  if (loading.value) {
    return
  }

  // 未認証の場合
  if (!user.value) {
    // ログイン・登録・ウェルカムページ以外はウェルカムページへ
    const publicPages = ['/login', '/register', '/welcome']
    if (!publicPages.includes(to.path)) {
      return navigateTo('/welcome')
    }
  } else {
    // 認証済みの場合
    // ログイン・登録・ウェルカムページにアクセスしたらダッシュボードへ
    const authPages = ['/login', '/register', '/welcome']
    if (authPages.includes(to.path)) {
      return navigateTo('/')
    }
  }
})
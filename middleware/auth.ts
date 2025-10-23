// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user, loading } = useAuth()

  // ローディング中は待機
  if (loading.value) {
    return
  }

  // 未認証の場合はログインページへリダイレクト
  if (!user.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // 認証済みでログインページにアクセスした場合はホームへ
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
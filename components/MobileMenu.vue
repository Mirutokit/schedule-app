<!-- components/MobileMenu.vue -->
<template>
    <div>
        <!-- モバイルメニューボタン -->
        <button @click="isOpen = !isOpen"
            class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" aria-label="メニュー">
            <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- モバイルメニュー（オーバーレイ） -->
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" @click="isOpen = false">
            </div>
        </Transition>

        <!-- サイドメニュー -->
        <Transition enter-active-class="transition-transform duration-300" enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300"
            leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
            <div v-if="isOpen"
                class="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
                <div class="p-4 border-b">
                    <h2 class="text-xl font-bold text-gray-800">メニュー</h2>
                </div>

                <nav class="p-4 space-y-2">
                    <NuxtLink to="/" @click="isOpen = false"
                        class="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-700': $route.path === '/' }">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span class="font-medium">ダッシュボード</span>
                        </div>
                    </NuxtLink>

                    <NuxtLink to="/calendar" @click="isOpen = false"
                        class="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-700': $route.path === '/calendar' }">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="font-medium">カレンダー</span>
                        </div>
                    </NuxtLink>

                    <!-- メンバー追加 -->
                    <NuxtLink to="/members" @click="isOpen = false"
                        class="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-700': $route.path.startsWith('/members') }">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span class="font-medium">メンバー</span>
                        </div>
                    </NuxtLink>

                    <NuxtLink to="/history" @click="isOpen = false"
                        class="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-700': $route.path === '/history' }">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-medium">履歴</span>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/profile" @click="isOpen = false"
                        class="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-700': $route.path === '/profile' }">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="font-medium">プロフィール</span>
                        </div>
                    </NuxtLink>

                </nav>

                <div class="p-4 border-t mt-auto">
                    <div v-if="user" class="space-y-3">
                        <div class="px-4 py-2 bg-gray-50 rounded-lg">
                            <p class="text-sm text-gray-600">ログイン中</p>
                            <p class="font-semibold text-gray-900">{{ userData?.displayName }}</p>
                        </div>
                        <button @click="handleLogout"
                            class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                            ログアウト
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, logout, getUserData } = useAuth()
const router = useRouter()
const userData = ref<any>(null)
const isOpen = ref(false)

watchEffect(async () => {
    if (user.value) {
        userData.value = await getUserData(user.value.uid)
    }
})

const handleLogout = async () => {
    try {
        await logout()
        isOpen.value = false
        router.push('/login')
    } catch (e) {
        console.error('ログアウト失敗:', e)
    }
}

// ルート変更時にメニューを閉じる
watch(() => router.currentRoute.value.path, () => {
    isOpen.value = false
})
</script>
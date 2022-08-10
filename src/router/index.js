import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const routes = [
  {
    path: '/auth',
    component: () => import('@/views/AuthBase.vue')
  },
  {
    path: '/',
    redirect: '/posts',
    component: () => import('@/views/AuthCenter.vue'),
    children: [
      {
        path: '/posts',
        component: () => import('@/components/PostsWall.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/post/:post_id',
        component: () => import('@/components/PostOnly.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/info/:user_id',
        component: () => import('@/components/UserInfo.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/likes/:user_id',
        component: () => import('@/components/UserLike.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/followings/:user_id',
        component: () => import('@/components/UserFollowing.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/followers/:user_id',
        component: () => import('@/components/UserFollower.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/notfound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  }
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const { tryLogin } = userStore

  if (tryLogin() && to.path === '/auth') return '/posts'

  if (!tryLogin() && to.meta.requiresAuth) return '/auth'
  else return true
})

export default router

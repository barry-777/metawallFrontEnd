import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const routes = [
  {
    path: '/',
    redirect: '/posts-wall'
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthBase.vue')
  },
  {
    path: '/posts-wall',
    component: () => import('@/views/AuthCenter.vue'),
    children: [
      {
        path: '/posts-wall',
        component: () => import('@/components/PostsWall.vue'),
        meta: { requiresAuth: true }
      }
    ]
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

router.beforeEach(to => {
  const userStore = useUserStore()
  const { tryLogin } = userStore

  if (tryLogin() && to.path === '/auth') return '/posts-wall'

  if (!tryLogin() && to.meta.requiresAuth) return '/auth'
  else return true
})

export default router

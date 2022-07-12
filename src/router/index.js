import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/index'
    // component: () => import('/src/components/HelloWorld.vue')
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthBase.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  }
})

export default router

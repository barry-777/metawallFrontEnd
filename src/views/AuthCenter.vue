<template>
  <section class="auth-center">
    <div class="container-box">
      <div class="max">
        <router-view />
      </div>
      <SideBar />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import SideBar from '@/components/SideBar.vue'
import { useUserStore } from '@/stores/user'
// import { useModalStore } from '@/stores/modal'
import { getCurrentUser } from '@/fetch/fetch'

// store 資料
const userStore = useUserStore()
// const modalStore = useModalStore()
const { patchUser } = userStore
// const { openLoading, closeLoading } = modalStore

// 取得個人資料
const getProfile = async () => {
  const { data } = await getCurrentUser()
  if (data.status) {
    patchUser({
      user_id: data.data._id,
      name: data.data.name,
      avatar: data.data.avatar
    })
  }
}
onMounted(async () => {
  if (!userStore.user_id) {
    await getProfile()
  }
})
</script>
›

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.auth-center {
  .container-box {
    align-items: flex-start;
    background-color: $c-gray-1;
  }
  .max {
    width: 100%;
    max-width: 950px;
    margin-right: 30px;
  }
}
</style>

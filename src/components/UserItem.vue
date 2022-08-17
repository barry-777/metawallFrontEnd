<template>
  <div
    v-if="hasData"
    class="user"
  >
    <div class="user-inner">
      <router-link :to="`/user/info/${props.user._id}`">
        <div class="user-photo-outer">
          <UserPhoto :photo="props.user.avatar" />
        </div>
        <div class="name">
          {{ props.user.name }}
        </div>
      </router-link>
      <button
        v-if="followMode"
        class="base-button"
        type="button"
        @click="patchFollowsHandler(props.user._id)"
      >
        取消追蹤
      </button>
      <button
        v-else
        class="base-button"
        type="button"
        @click="patchFollowsHandler(props.user._id)"
      >
        追蹤
      </button>
    </div>
  </div>
  <div
    v-else
    class="no-data"
  >
    <div class="top-bar">
      <div />
      <div />
      <div />
    </div>
    <div class="no-t">
      目前無法取得更多使用者！
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { patchFollows } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'

const modalStore = useModalStore()
const userStore = useUserStore()
const { user_id } = storeToRefs(userStore)
const { openAlert, openLoading, closeLoading } = modalStore

const props = defineProps({
  user: Object
})

// 確認是否有資料
const hasData = ref(null)
// 追蹤狀態
const followMode = ref(false)
// 確認資料進來
onMounted(() => {
  hasData.value = Object.keys(props.user).length !== 0

  if (props.user?.followers?.some(item => item.user === user_id.value)) {
    followMode.value = true
  } else {
    followMode.value = false
  }
})

// 追蹤功能
const patchFollowsHandler = async (params_id) => {
  const mode = followMode.value ? 'unfollow' : 'follow'

  if (mode === 'unfollow') {
    openLoading('取消追蹤中')
  } else {
    openLoading('追蹤中')
  }

  // 更新狀態
  await patchFollows(params_id, mode)

  followMode.value = !followMode.value

  closeLoading()

  if (mode === 'unfollow') {
    openAlert('success', '已取消追蹤！')
  } else {
    openAlert('success', '已追蹤！')
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.user {
  padding: 15px 40px;
  margin: 0 10px 15px;
  background: $c-white;
  border: 2px solid $c-black;
  border-radius: 8px;
  .user-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    a {
      display: block;
      &:hover {
        .name {
          color: $c-first;
        }
      }
    }
    .user-photo-outer{
      width: 60px;
      height: 60px;
      margin: 0;
    }
    .name {
      width: 100%;
      font-size: px(18);
      font-weight: $medium;
      line-height: 1.4;
      text-align: center;
      margin-top: 8px;
    }
    .base-button {
      margin-top: 15px;
      padding: 8px;
    }
  }
}
</style>

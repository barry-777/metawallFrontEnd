<template>
  <div class="user-info">
    <div class="top-info">
      <div class="status">
        <div class="base">
          <div class="user-photo-outer">
            <UserPhoto :photo="nowUser.avatar" />
          </div>
          <div class="now-user">
            <div class="name">
              {{ nowUser.name }}
            </div>
            <div class="create">
              創立日期： {{ dateFormat(nowUser.createdAt) }}
            </div>
          </div>
        </div>
        <div class="detail">
          <div class="now-posts">
            <span>貼文</span>
            <p>{{ posts?.length }}</p>
          </div>
          <div class="followers">
            <router-link :to="`/user/followings/${route.params.user_id}`">
              <span>追蹤中</span>
              <p>{{ nowUser.followings?.length }}</p>
            </router-link>
          </div>
          <div class="followings">
            <router-link :to="`/user/followers/${route.params.user_id}`">
              <span>粉絲</span>
              <p>{{ nowUser.followers?.length }}</p>
            </router-link>
          </div>
        </div>
      </div>
      <router-link
        v-if="user_id === nowUser._id"
        class="base-button file"
        to="/user/update"
      >
        編輯個人檔案
      </router-link>
      <div class="tool">
        <template v-if="user_id !== nowUser._id">
          <button
            v-if="followMode"
            class="base-button"
            type="button"
            @click="patchFollowsHandler(nowUser._id)"
          >
            取消追蹤
          </button>
          <button
            v-else
            class="base-button"
            type="button"
            @click="patchFollowsHandler(nowUser._id)"
          >
            追蹤
          </button>
        </template>
      </div>
    </div>
    <div class="bottom-posts">
      <template v-if="posts?.length">
        <PostItem
          v-for="post in posts"
          :key="post._id"
          :post="post"
        />
      </template>
      <template v-else>
        <PostItem
          :post="{}"
        />
      </template>
      <PostBox />
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import { storeToRefs } from 'pinia'
import { ref, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { dateFormat } from '@/services/helper'
import { getPostsById, getUserInfo, patchFollows } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const userStore = useUserStore()
const postStore = usePostStore()
const { user_id } = storeToRefs(userStore)
const { posts, routeQuery } = storeToRefs(postStore)
const { openAlert, openLoading, closeLoading } = modalStore
const { patchPosts, resetPosts, patchQuery } = postStore

const nowUser = ref([])
const followMode = ref(false)

const getInfoHandler = async (params_id) => {
  openLoading()
  const { data: userData } = await getUserInfo(params_id)
  if (!userData.data) router.push('/notfound')
  nowUser.value = userData.data
  followMode.value = nowUser.value.followers.some(item => item.user === user_id.value)
  await patchQuery([route.query])
  const { data } = await getPostsById(params_id, routeQuery.value)
  if (!data.data) router.push('/notfound')
  await patchPosts(data.data)
  closeLoading()
}

getInfoHandler(route.params.user_id)

watch(() => route.params.user_id, () => {
  const rule = router.currentRoute.value.fullPath.startsWith('/user/info/')
  if (!rule) return false
  getInfoHandler(route.params.user_id)
})

onBeforeUnmount(() => {
  nowUser.value = []
  resetPosts()
})

// 追蹤功能
const patchFollowsHandler = async (params_id) => {
  openLoading()
  const mode = followMode.value ? 'unfollow' : 'follow'

  // 更新狀態
  await patchFollows(params_id, mode)

  if (mode === 'unfollow') {
    const aryIndex = nowUser.value.followers.findIndex(s => s.user === user_id)
    nowUser.value.followers.splice(aryIndex, 1)
  } else {
    nowUser.value.followers.push(user_id)
  }

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
.top-info {
  width: 100%;
  padding: 25px 25px 30px;
  border-radius: 8px 8px 15px 15px;
  box-shadow: 0 2px 10px rgba($c-black, .25);
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba($c-white, .7);
    backdrop-filter: blur(3px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  > * {
    position: relative;
    z-index: 1;
  }
  @include mobile {
    padding: 20px 15px 15px;
  }
}
.status {
  width: 100%;
  display: flex;
}
.base {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-shrink: 0;
  .user-photo-outer {
    width: 55px;
    height: 55px;
    margin-right: 0;
    margin-bottom: 10px;
  }
  .now-user {
    padding-left: 5px;
  }
  .name {
    font-size: px(18);
    font-weight: $medium;
  }
  .create {
    font-size: px(12);
    margin-top: 8px;
    color: $c-gray-4;
  }
  @include mobile {
    .create {
      display: none;
    }
  }
}
.detail {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 15px;
  > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    a {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    span {
      font-size: px(14);
      font-weight: $medium;
    }
    p {
      font-size: px(18);
      font-weight: $medium;
      margin-top: 8px;
    }
  }
  @include mobile {
    padding-left: 10px;
  }
}
.tool {
  width: 100%;
  display: flex;
  margin-top: 20px;
}
.base-button {
  &:not(:first-child) {
    margin-left: 10px;
  }
}
.base-button.file {
  margin: 0;
  margin-top: 25px;
}
.bottom-posts {
  margin-top: 50px;
}
</style>

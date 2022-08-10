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
              <p>{{ nowUser.followers?.length }}</p>
            </router-link>
          </div>
          <div class="followings">
            <router-link :to="`/user/followers/${route.params.user_id}`">
              <span>粉絲</span>
              <p>{{ nowUser.followings?.length }}</p>
            </router-link>
          </div>
        </div>
      </div>
      <div
        v-if="user_id === nowUser._id"
        class="btn file"
      >
        編輯個人檔案
      </div>
      <div class="tool">
        <div
          v-if="user_id !== nowUser._id"
          class="btn"
        >
          追蹤
        </div>
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
import PostBox from '@/components/PostBox.vue'
import { storeToRefs } from 'pinia'
import { ref, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { dateFormat } from '@/services/helper'
import { getPostsById, getUserInfo } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const userStore = useUserStore()
const postStore = usePostStore()
const { user_id } = storeToRefs(userStore)
const { posts, postQuery } = storeToRefs(postStore)
const { openLoading, closeLoading } = modalStore
const { patchPosts, resetPosts, patchQuery } = postStore

const nowUser = ref([])

const getInfoHandler = async (params_id) => {
  openLoading()
  const { data: userData } = await getUserInfo(params_id)
  nowUser.value = userData.data
  await patchQuery([route.query])
  const { data } = await getPostsById(params_id, postQuery.value)
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
  nowUser.value.length = 0
  resetPosts()
})
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
  > div {
    position: relative;
    z-index: 1;
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
    font-size: px(14);
    margin-top: 8px;
    color: $c-gray-4;
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
}
.tool {
  width: 100%;
  display: flex;
  margin-top: 15px;
}
.btn {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  color: $c-black;
  border: 2px solid $c-black;
  text-align: center;
  user-select: none;
  cursor: pointer;
  &:not(:first-child) {
    margin-left: 10px;
  }
  &:hover {
    color: $c-first;
    transition: .4s;
  }
}
.btn.file {
  margin: 0;
  margin-top: 25px;
}
.bottom-posts {
  margin-top: 50px;
}
</style>

<template>
  <div
    class="post"
    :class="{ 'only': !hasData }"
  >
    <template v-if="hasData">
      <div class="content">
        <div class="top">
          <router-link :to="`/user/likes/${props.post.user._id}`">
            <div class="user-photo-outer">
              <UserPhoto :photo="props.post.user.avatar" />
            </div>
            <div class="user-name">
              <p>{{ props.post.user.name }}</p>
              <p>{{ dateFormat(props.post.createdAt) }}</p>
            </div>
          </router-link>
          <div
            v-if="props.post.user._id === userStore.user_id"
            class="post-control"
          >
            <i
              class="fa-solid fa-ellipsis"
              @click.stop="showPostControl = !showPostControl"
            />
            <div v-if="showPostControl">
              <ul>
                <li @click="openPostUploadBox(true, props.post)">
                  編輯貼文
                </li>
                <li @click="deletePostHandler(props.post)">
                  刪除貼文
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="middle">
          <div class="inner-t serEditorCss">
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="props.post.content" />
            <!--eslint-enable-->
          </div>
          <div
            v-if="props.post.images?.length"
            class="inner-photo"
          >
            <div
              v-if="props.post.images[0]?.link"
              class="img-control"
            >
              <img
                :src="props.post.images[0].link"
                alt=""
              >
            </div>
            <div
              v-if="props.post.images[1]?.link"
              class="img-control"
            >
              <img
                :src="props.post.images[1].link"
                alt=""
              >
            </div>
            <div
              v-if="props.post.images?.length >= 2"
              class="img-more"
              @click="openImagesBox(true, props.post.images)"
            >
              <i class="fa-regular fa-square-plus" />
              <p>MORE</p>
            </div>
          </div>
        </div>
        <div class="bottom">
          <PostTool :post="props.post" />
          <CommentWall :comments="props.post.comments" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="top-bar">
        <div />
        <div />
        <div />
      </div>
      <div class="content">
        <div class="no-t">
          目前尚無貼文！
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import CommentWall from '@/components/CommentWall.vue'
import PostTool from '@/components/PostTool.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { dateFormat } from '@/services/helper'
import { getPostsByRoute, deleteOnePost, deleteUploadImage } from '@/fetch/fetch'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useModalStore } from '@/stores/modal'

const route = useRoute()
const modalStore = useModalStore()
const userStore = useUserStore()
const postStore = usePostStore()
const { postQuery } = storeToRefs(postStore)
const { openLoading, closeLoading, openAlert, openPostUploadBox, openImagesBox } = modalStore
const { patchPosts, patchQuery } = postStore

const props = defineProps({
  post: Object
})

// 確認是否有資料
const hasData = ref(null)
hasData.value = Object.keys(props.post).length !== 0

// 控制視窗
const showPostControl = ref(false)

// 刪除貼文
const deletePostHandler = async (post) => {
  openLoading('刪除貼文中')
  for await (const image of post.images) {
    await deleteUploadImage(image.hash)
  }
  await deleteOnePost(post._id)
  await patchQuery([route.query])
  const results = await getPostsByRoute(postQuery.value)
  await patchPosts(results.data.data)
  closeLoading()
  openAlert('success', '刪除貼文成功！')
}

onMounted(() => {
  document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('post-control') && !e.target.closest('.post-control')) {
      showPostControl.value = false
    }
  })
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.post {
  width: 100%;
  background-color: $c-white;
  border-radius: 8px;
  border: 2px solid $c-black;
  border-bottom: 4px solid $c-black;
  box-shadow: 0 3px 5px rgba($c-black, 0.3);
  padding: 25px 22px;
  &:not(:first-child) {
    margin-top: 25px;
  }
}
.content {
  width: 100%;
  min-height: 100px;
}
.top {
  display: flex;
  align-items: flex-start;
  a {
    display: inline-flex;
    align-items: flex-start;
    &:hover {
      p:nth-child(1) {
        color: $c-first;
      }
    }
  }
  p:nth-child(1) {
    font-size: px(14);
    font-weight: $medium;
    margin-top: 5px;
  }
  p:nth-child(2) {
    font-size: px(12);
    color: $c-gray-4;
    margin-top: 8px;
  }
}
.post-control {
  margin-left: auto;
  position: relative;
  cursor: pointer;
  user-select: none;
  > i {
    font-size: px(25);
  }
  > div {
    width: auto;
    height: auto;
    position: absolute;
    right: 0;
    top: 22px;
    z-index: 5;
  }
  ul {
    width: 100%;
    border: 2px solid $c-black;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba($c-black, .3);
  }
  li {
    width: 100%;
    padding: 10px 15px;
    background-color: $c-white;
    white-space: nowrap;
    transition: background-color .6s;
    &:hover {
      background-color: darken($c-white, 15%);
    }
  }
}
.middle {
  width: 100%;
  min-height: 150px;
  padding-left: 10px;
  margin-top: 15px;
}
.inner-t {
  font-size: px(14);
  line-height: 1.4;
  letter-spacing: 1.2px;
}
.inner-photo {
  display: flex;
  align-items: stretch;
  margin-top: 10px;
  .img-control {
    width: 33.333%;
    border-radius: 10px;
    border: 2px solid $c-black;
    position: relative;
    overflow: hidden;
    margin-right: 5px;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    &:only-child {
      width: 60%;
    }
  }
  .img-more {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    width: 150px;
    padding: 15px;
    border-radius: 10px;
    color: $c-white;
    background-color: rgba($c-black, 0.5);
    backdrop-filter: blur(3px);
    user-select: none;
    cursor: pointer;
    transition: 0.6s;
    &:hover {
      background-color: rgba($c-black, 0.6);
    }
    i {
      font-size: px(20);
    }
    p {
      font-size: px(14);
      font-weight: $medium;
      letter-spacing: 1.2px;
      margin-top: 5px;
    }
  }
}
.bottom {
  width: 100%;
}
// 無貼文樣式
.post.only {
  padding: 0;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .top-bar {
    display: flex;
    align-content: center;
  }
  .no-t {
    display: flex;
    align-content: center;
    justify-content: center;
  }
}
.top-bar {
  display: none;
  width: 100%;
  padding: 15px;
  border-bottom: 2px solid $c-black;
  padding: 12px 15px;
  > div {
    width: 8px;
    height: 8px;
    margin: 3px;
    border-radius: 50%;
    border: 1px solid $c-gray-4;
  }
  > div:nth-child(1) {
    background-color: $c-red;
  }
  > div:nth-child(2) {
    background-color: $c-yellow;
  }
  > div:nth-child(3) {
    background-color: $c-green;
  }
}
.no-t {
  display: none;
  width: 100%;
  height: 100%;
  color: $c-gray-4;
}
</style>

<template>
  <div class="user-like">
    <div class="common-title">
      <p v-if="user_id === route.params.user_id">
        我收藏的貼文
      </p>
      <p v-else>
        {{ name }} 收藏的貼文
      </p>
    </div>
    <div class="posts">
      <template v-if="posts.length">
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
    </div>
  </div>
  <Transition name="fade">
    <ImagesBox
      v-if="showImagesBox"
    />
  </Transition>
  <Transition name="fade-model">
    <PostUploadBox
      v-if="showPostUploadBox"
    />
  </Transition>
  <Transition name="fade-model">
    <PostLikesBox
      v-if="showPostLikesBox"
    />
  </Transition>
  <Transition name="fade-model">
    <CommentEditorBox
      v-if="showCommentEditorBox"
    />
  </Transition>
</template>

<script setup>
import PostItem from '@/components/PostItem.vue'
import ImagesBox from '@/components/ImagesBox.vue'
import PostUploadBox from '@/components/PostUploadBox.vue'
import PostLikesBox from '@/components/PostLikesBox.vue'
import CommentEditorBox from '@/components/CommentEditorBox.vue'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { getLikePosts } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()
const userStore = useUserStore()
const { showImagesBox, showPostUploadBox, showPostLikesBox, showCommentEditorBox } = storeToRefs(modalStore)
const { posts } = storeToRefs(postStore)
const { user_id, name } = storeToRefs(userStore)
const { openAlert, openLoading, closeLoading } = modalStore
const { resetPosts } = postStore

const getLikePostsHandler = async (user_id) => {
  openLoading('取得收藏貼文中！')
  const { data } = await getLikePosts(user_id)
  if (!data.data) router.push('/notfound')
  posts.value = data.data
  closeLoading()
  openAlert('success', '取得成功！')
}

getLikePostsHandler(route.params.user_id)

watch(() => route.params.user_id, (nV, oV) => {
  resetPosts()
  getLikePostsHandler(route.params.user_id)
})

onBeforeUnmount(() => {
  resetPosts()
})
</script>

<style scoped lang="scss"></style>
